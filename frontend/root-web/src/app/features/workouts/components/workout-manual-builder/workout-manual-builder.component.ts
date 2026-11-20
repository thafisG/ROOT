import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionFeedbackService } from '../../../../core/feedback/action-feedback.service';
import { WorkoutExerciseDraft, WorkoutService } from '../../workout.service';
import { WorkoutImportComponent } from '../workout-import/workout-import.component';

type BuilderMode = 'message' | 'photo' | 'manual';
interface DraftRoutineGroup {
  id: string;
  name: string;
  sourceMode?: BuilderMode;
}

@Component({
  selector: 'app-workout-manual-builder',
  imports: [ReactiveFormsModule, WorkoutImportComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workout-manual-builder.component.html',
  styleUrl: './workout-manual-builder.component.scss',
})
export class WorkoutManualBuilderComponent {
  private readonly fb = inject(FormBuilder);
  private readonly workouts = inject(WorkoutService);
  private readonly feedback = inject(ActionFeedbackService);

  protected readonly exerciseForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    sets: [3, [Validators.required, Validators.min(1), Validators.max(20)]],
    repetitions: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
    restSeconds: [60, [Validators.required, Validators.min(0), Validators.max(300)]],
    load: ['', Validators.maxLength(40)],
    notes: ['', Validators.maxLength(160)],
  });
  protected readonly exercises = signal<WorkoutExerciseDraft[]>([]);
  protected readonly groups = signal<DraftRoutineGroup[]>([]);
  protected readonly activeGroupId = signal('');
  protected readonly selectedMode = signal<BuilderMode | null>(null);
  protected readonly selectedExerciseIds = signal<Set<string>>(new Set());
  protected readonly moveDestinations = signal<Record<string, string>>({});
  protected readonly lastMovedExercise = signal('');
  protected readonly confirmClearAll = signal(false);
  protected readonly exerciseError = signal('');
  protected readonly progress = computed(() => Math.min(100, Math.round((this.exercises().length / 3) * 100)));
  protected readonly progressLabel = computed(() => {
    const count = this.exercises().length;
    if (count === 0) return 'Sua ficha começa com uma ideia';
    if (count < 3) return `Bom começo: ${count} exercício${count === 1 ? '' : 's'} adicionado${count === 1 ? '' : 's'}`;
    return 'Ficha pronta para revisar';
  });

  protected selectMode(mode: BuilderMode): void {
    const currentMode = this.selectedMode();
    if (currentMode === mode) {
      this.clearMode(mode);
      this.selectedMode.set(null);
      return;
    }
    if (currentMode) this.clearMode(currentMode);
    this.selectedMode.set(mode);
    this.exerciseError.set('');
  }

  protected deselectMode(): void {
    const mode = this.selectedMode();
    if (mode) this.clearMode(mode);
    this.selectedMode.set(null);
  }

  private clearMode(mode: BuilderMode): void {
    this.exercises.update((items) => items.filter((item) => item.sourceMode !== mode));
    const remainingIds = new Set(this.exercises().map((item) => item.id));
    this.selectedExerciseIds.update((ids) => new Set([...ids].filter((id) => remainingIds.has(id))));
    this.moveDestinations.update((destinations) => Object.fromEntries(Object.entries(destinations).filter(([id]) => remainingIds.has(id))));
    this.pruneEmptyGroups();
    if (mode === 'manual') this.exerciseForm.reset({ name: '', sets: 3, repetitions: 10, restSeconds: 60, load: '', notes: '' });
    this.exerciseError.set('');
  }

  protected addGroup(name = '', sourceMode: BuilderMode = 'manual'): void {
    const group: DraftRoutineGroup = { id: crypto.randomUUID(), name: name.trim().slice(0, 40), sourceMode };
    this.groups.update((items) => [...items, group]);
    this.activeGroupId.set(group.id);
    this.exerciseError.set('');
  }

  protected renameGroup(id: string, event: Event): void {
    const name = (event.target as HTMLInputElement).value.slice(0, 40);
    this.groups.update((items) => items.map((group) => group.id === id ? { ...group, name } : group));
    this.exerciseError.set('');
  }

  protected addExercise(): void {
    this.exerciseForm.markAllAsTouched();
    this.exerciseError.set('');
    if (this.exerciseForm.invalid) return;
    if (this.exercises().length >= 20) {
      this.exerciseError.set('Cada rascunho pode ter até 20 exercícios.');
      return;
    }
    const group = this.groups().find((item) => item.id === this.activeGroupId());
    if (!group) {
      this.exerciseError.set('Crie uma ficha personalizada antes de adicionar exercícios.');
      return;
    }

    this.exercises.update((items) => [...items, {
      id: crypto.randomUUID(),
      ...this.exerciseForm.getRawValue(),
      groupId: group.id,
      sourceMode: 'manual',
    }]);
    this.exerciseForm.controls.name.reset();
    this.exerciseForm.controls.name.markAsUntouched();
    this.exerciseForm.controls.sets.setValue(3);
    this.exerciseForm.controls.repetitions.setValue(10);
    this.exerciseForm.controls.restSeconds.setValue(60);
    this.exerciseForm.controls.load.reset('');
    this.exerciseForm.controls.notes.reset('');
  }

  protected updateExercise(id: string, field: 'name' | 'sets' | 'repetitions' | 'restSeconds', event: Event): void {
    const input = event.target as HTMLInputElement;
    this.exercises.update((items) => items.map((item) => {
      if (item.id !== id) return item;
      if (field === 'name') return { ...item, name: input.value };
      return { ...item, [field]: Number(input.value) };
    }));
  }

  protected updateExerciseText(id: string, field: 'load' | 'notes', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.exercises.update((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  protected removeExercise(id: string): void {
    this.exercises.update((items) => items.filter((item) => item.id !== id));
    this.selectedExerciseIds.update((ids) => new Set([...ids].filter((selectedId) => selectedId !== id)));
    this.pruneEmptyGroups();
    this.exerciseError.set('');
  }

  protected setMoveDestination(id: string, event: Event): void {
    const groupId = (event.target as HTMLSelectElement).value;
    this.moveDestinations.update((destinations) => ({ ...destinations, [id]: groupId }));
  }

  protected moveExercise(id: string, currentGroupId: string): void {
    const groupId = this.moveDestinations()[id] ?? currentGroupId;
    if (!this.groups().some((group) => group.id === groupId) || groupId === currentGroupId) return;
    this.exercises.update((items) => items.map((item) => item.id === id ? { ...item, groupId } : item));
    const exercise = this.exercises().find((item) => item.id === id);
    const group = this.groups().find((item) => item.id === groupId);
    this.lastMovedExercise.set(exercise && group ? `${exercise.name} movido para ${group.name || 'ficha sem nome'}.` : 'Exercício movido.');
    this.selectedExerciseIds.update((ids) => new Set([...ids].filter((selectedId) => selectedId !== id)));
  }

  protected exercisesInGroup(groupId: string): WorkoutExerciseDraft[] {
    return this.exercises().filter((item) => item.groupId === groupId);
  }

  protected groupById(id: string): DraftRoutineGroup | undefined {
    return this.groups().find((group) => group.id === id);
  }

  protected separateExercise(item: WorkoutExerciseDraft): void {
    this.addGroup('', this.selectedMode() ?? 'manual');
    const groupId = this.activeGroupId();
    this.exercises.update((items) => items.map((exercise) => exercise.id === item.id ? { ...exercise, groupId } : exercise));
  }

  protected toggleExerciseSelection(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedExerciseIds.update((ids) => {
      const next = new Set(ids);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  protected toggleAllExerciseSelection(event: Event): void {
    this.selectedExerciseIds.set((event.target as HTMLInputElement).checked ? new Set(this.exercises().map((item) => item.id)) : new Set());
  }

  protected deleteSelectedExercises(): void {
    const ids = this.selectedExerciseIds();
    if (!ids.size) return;
    this.exercises.update((items) => items.filter((item) => !ids.has(item.id)));
    this.selectedExerciseIds.set(new Set());
    this.pruneEmptyGroups();
    this.feedback.show(`${ids.size} ${ids.size === 1 ? 'exercício removido' : 'exercícios removidos'} do rascunho.`);
  }

  protected deleteAllDraftExercises(): void {
    if (!this.exercises().length) return;
    this.exercises.set([]);
    this.groups.set([]);
    this.activeGroupId.set('');
    this.selectedExerciseIds.set(new Set());
    this.moveDestinations.set({});
    this.confirmClearAll.set(false);
    this.feedback.show('Todos os exercícios do rascunho foram apagados.');
  }

  private pruneEmptyGroups(): void {
    const occupied = new Set(this.exercises().map((item) => item.groupId).filter((id): id is string => !!id));
    this.groups.update((groups) => groups.filter((group) => occupied.has(group.id)));
    if (!this.groups().some((group) => group.id === this.activeGroupId())) this.activeGroupId.set(this.groups()[0]?.id ?? '');
  }

  protected addImportedExercises(imported: WorkoutExerciseDraft[]): void {
    if (!imported.length) return;
    const remaining = Math.max(0, 20 - this.exercises().length);
    const sourceMode: 'photo' | 'message' = this.selectedMode() === 'photo' ? 'photo' : 'message';
    const incoming = imported.slice(0, remaining);
    const groupIdsByName = new Map(this.groups().filter((group) => group.name).map((group) => [group.name, group.id]));
    let unnamedGroupId = this.groups().find((group) => !group.name)?.id;
    const added = incoming.map((item) => {
      const name = item.groupName?.trim() ?? '';
      let groupId = name ? groupIdsByName.get(name) : unnamedGroupId;
      if (!groupId) {
        const group: DraftRoutineGroup = { id: crypto.randomUUID(), name, sourceMode };
        this.groups.update((groups) => [...groups, group]);
        groupId = group.id;
        if (name) groupIdsByName.set(name, groupId);
        else unnamedGroupId = groupId;
      }
      return { ...item, groupId, sourceMode };
    });
    this.exercises.update((items) => [...items, ...added]);
    if (added.length) this.activeGroupId.set(added[0].groupId ?? '');
    if (added.length < imported.length) this.exerciseError.set('O rascunho aceita até 20 exercícios; alguns itens não foram adicionados.');
    this.feedback.show(`${added.length} exercícios importados. Revise os nomes e as fichas antes de salvar.`);
  }

  protected saveRoutines(): void {
    this.exerciseError.set('');
    if (!this.exercises().length) {
      this.exerciseError.set('Adicione pelo menos um exercício antes de salvar.');
      return;
    }
    const groupsWithExercises = this.groups()
      .map((group) => ({ ...group, exercises: this.exercisesInGroup(group.id) }))
      .filter((group) => group.exercises.length > 0);
    const names = groupsWithExercises.map((group) => group.name.trim().toLocaleLowerCase());
    if (groupsWithExercises.some((group) => !group.name.trim())) {
      this.exerciseError.set('Dê um nome para cada ficha antes de salvar.');
      return;
    }
    if (new Set(names).size !== names.length) {
      this.exerciseError.set('Cada ficha precisa ter um nome diferente.');
      return;
    }

    for (const group of groupsWithExercises) {
      const exerciseList = group.exercises.map((item) =>
        `${item.name.trim()} — ${item.sets}×${item.repetitions}${item.restSeconds ? ` — descanso ${item.restSeconds}s` : ''}${item.load?.trim() ? ` — carga/equipamento: ${item.load.trim()}` : ''}${item.notes?.trim() ? ` — observação: ${item.notes.trim()}` : ''}`,
      );
      this.workouts.create(group.name, exerciseList);
    }
    this.exerciseForm.reset({ name: '', sets: 3, repetitions: 10, restSeconds: 60, load: '', notes: '' });
    this.exercises.set([]);
    this.groups.set([]);
    this.activeGroupId.set('');
    this.selectedExerciseIds.set(new Set());
    this.moveDestinations.set({});
    this.lastMovedExercise.set('');
    this.feedback.show(`${groupsWithExercises.length} ${groupsWithExercises.length === 1 ? 'ficha salva' : 'fichas salvas'}. Já estão disponíveis em Fichas salvas.`);
  }
}
