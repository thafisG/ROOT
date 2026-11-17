import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionFeedbackService } from '../../../../core/feedback/action-feedback.service';
import { WorkoutExerciseDraft, WorkoutService } from '../../workout.service';
import { WorkoutImportComponent } from '../workout-import/workout-import.component';

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
  });
  protected readonly exercises = signal<WorkoutExerciseDraft[]>([]);
  protected readonly groupNames = signal<string[]>(['Treino A']);
  protected readonly activeGroup = signal('Treino A');
  protected readonly selectedMode = signal<'message' | 'photo' | 'manual' | null>(null);
  protected readonly selectedExerciseIds = signal<Set<string>>(new Set());
  protected readonly moveDestinations = signal<Record<string, string>>({});
  protected readonly lastMovedExercise = signal('');
  protected readonly confirmClearAll = signal(false);
  protected readonly exerciseError = signal('');
  protected readonly progress = computed(() => Math.min(100, Math.round((this.exercises().length / 3) * 100)));
  protected readonly progressLabel = computed(() => {
    const count = this.exercises().length;
    if (count === 0) return 'Comece adicionando seu primeiro exercício';
    if (count < 3) return `Boa! Mais ${3 - count} para completar sua ficha`;
    return 'Ficha pronta para salvar';
  });

  protected selectMode(mode: 'message' | 'photo' | 'manual'): void {
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

  private clearMode(mode: 'message' | 'photo' | 'manual'): void {
    this.exercises.update((items) => items.filter((item) => item.sourceMode !== mode));
    const remainingIds = new Set(this.exercises().map((item) => item.id));
    this.selectedExerciseIds.update((ids) => new Set([...ids].filter((id) => remainingIds.has(id))));
    this.moveDestinations.update((destinations) => Object.fromEntries(Object.entries(destinations).filter(([id]) => remainingIds.has(id))));
    const usedGroups = new Set(this.exercises().map((item) => item.groupName ?? 'Treino A'));
    this.groupNames.update((groups) => groups.filter((name) => name === 'Treino A' || usedGroups.has(name)));
    if (!this.groupNames().includes(this.activeGroup())) this.activeGroup.set(this.groupNames()[0] ?? 'Treino A');
    if (mode === 'manual') this.exerciseForm.reset({ name: '', sets: 3, repetitions: 10, restSeconds: 60 });
    if (mode === 'photo') this.exerciseError.set('');
  }

  protected addExercise(): void {
    this.exerciseForm.markAllAsTouched();
    this.exerciseError.set('');
    if (this.exerciseForm.invalid) return;
    if (this.exercises().length >= 20) {
      this.exerciseError.set('Cada ficha pode ter até 20 exercícios.');
      return;
    }

    this.exercises.update((items) => [
      ...items,
      { id: crypto.randomUUID(), ...this.exerciseForm.getRawValue(), groupName: this.activeGroup(), sourceMode: 'manual' },
    ]);
    this.exerciseForm.controls.name.reset();
    this.exerciseForm.controls.name.markAsUntouched();
    this.exerciseForm.controls.sets.setValue(3);
    this.exerciseForm.controls.repetitions.setValue(10);
    this.exerciseForm.controls.restSeconds.setValue(60);
  }

  protected updateExercise(id: string, field: keyof Omit<WorkoutExerciseDraft, 'id'>, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.exercises.update((items) => items.map((item) => {
      if (item.id !== id) return item;
      if (field === 'name') return { ...item, name: input.value };
      return { ...item, [field]: Number(input.value) };
    }));
  }

  protected removeExercise(id: string): void {
    this.exercises.update((items) => items.filter((item) => item.id !== id));
    this.selectedExerciseIds.update((ids) => new Set([...ids].filter((selectedId) => selectedId !== id)));
    this.exerciseError.set('');
  }

  protected addGroup(): void {
    const nextIndex = this.groupNames().length;
    const suffix = String.fromCharCode(65 + Math.min(nextIndex, 25));
    let name = `Treino ${suffix}`;
    let version = 2;
    while (this.groupNames().includes(name)) name = `Treino ${suffix} ${version++}`;
    this.groupNames.update((groups) => [...groups, name]);
    this.activeGroup.set(name);
  }

  protected renameGroup(previousName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newName = input.value.trim().slice(0, 40);
    if (!newName || newName === previousName || this.groupNames().includes(newName)) return;
    this.groupNames.update((groups) => groups.map((name) => name === previousName ? newName : name));
    this.exercises.update((items) => items.map((item) => item.groupName === previousName ? { ...item, groupName: newName } : item));
    if (this.activeGroup() === previousName) this.activeGroup.set(newName);
  }

  protected setMoveDestination(id: string, event: Event): void {
    const groupName = (event.target as HTMLSelectElement).value;
    this.moveDestinations.update((destinations) => ({ ...destinations, [id]: groupName }));
  }

  protected moveExercise(id: string, currentGroup: string): void {
    const groupName = this.moveDestinations()[id] ?? currentGroup;
    if (!this.groupNames().includes(groupName) || groupName === currentGroup) return;
    this.exercises.update((items) => items.map((item) => item.id === id ? { ...item, groupName } : item));
    const exercise = this.exercises().find((item) => item.id === id);
    this.lastMovedExercise.set(exercise ? `${exercise.name} movido para ${groupName}.` : 'Exercício movido.');
    this.selectedExerciseIds.update((ids) => new Set([...ids].filter((selectedId) => selectedId !== id)));
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
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedExerciseIds.set(checked ? new Set(this.exercises().map((item) => item.id)) : new Set());
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
    const count = this.exercises().length;
    if (!count) return;
    this.exercises.set([]);
    this.selectedExerciseIds.set(new Set());
    this.moveDestinations.set({});
    this.groupNames.set(['Treino A']);
    this.activeGroup.set('Treino A');
    this.confirmClearAll.set(false);
    this.feedback.show('Todos os exercícios do rascunho foram apagados.');
  }

  private pruneEmptyGroups(): void {
    const usedGroups = new Set(this.exercises().map((item) => item.groupName ?? 'Treino A'));
    this.groupNames.update((groups) => groups.filter((name) => name === 'Treino A' || usedGroups.has(name)));
    if (!this.groupNames().includes(this.activeGroup())) this.activeGroup.set(this.groupNames()[0] ?? 'Treino A');
  }

  protected exercisesInGroup(groupName: string): WorkoutExerciseDraft[] {
    return this.exercises().filter((item) => (item.groupName ?? 'Treino A') === groupName);
  }

  protected separateExercise(item: WorkoutExerciseDraft): void {
    this.addGroup();
    const newGroup = this.groupNames()[this.groupNames().length - 1];
    this.exercises.update((items) => items.map((exercise) => exercise.id === item.id ? { ...exercise, groupName: newGroup } : exercise));
  }

  protected addImportedExercises(imported: WorkoutExerciseDraft[]): void {
    if (!imported.length) return;
    const remaining = Math.max(0, 20 - this.exercises().length);
    const sourceMode: 'photo' | 'message' = this.selectedMode() === 'photo' ? 'photo' : 'message';
    const added = imported.slice(0, remaining).map((item) => ({ ...item, sourceMode }));
    const groups = [...new Set(added.map((item) => item.groupName?.trim()).filter((name): name is string => !!name))];
    this.groupNames.update((current) => [...current, ...groups.filter((name) => !current.includes(name))]);
    this.exercises.update((items) => [...items, ...added]);
    if (groups.length) this.activeGroup.set(groups[0]);
    if (added.length < imported.length) this.exerciseError.set('A ficha aceita até 20 exercícios; alguns itens não foram adicionados.');
    this.feedback.show(`${added.length} exercícios importados. Confira e ajuste a ficha.`);
  }

  protected saveRoutines(): void {
    this.exerciseError.set('');
    if (!this.exercises().length) {
      this.exerciseError.set('Adicione pelo menos um exercício antes de salvar as fichas.');
      return;
    }

    const groupsWithExercises = this.groupNames()
      .map((name) => ({ name, exercises: this.exercises().filter((item) => item.groupName === name) }))
      .filter((group) => group.exercises.length > 0);
    for (const group of groupsWithExercises) {
      const exerciseList = group.exercises.map((item) =>
        `${item.name.trim()} — ${item.sets}×${item.repetitions}${item.restSeconds ? ` — descanso ${item.restSeconds}s` : ''}`,
      );
      this.workouts.create(group.name, exerciseList);
    }
    this.exerciseForm.reset({ name: '', sets: 3, repetitions: 10, restSeconds: 60 });
    this.exercises.set([]);
    this.selectedExerciseIds.set(new Set());
    this.moveDestinations.set({});
    this.lastMovedExercise.set('');
    this.groupNames.set(['Treino A']);
    this.activeGroup.set('Treino A');
    this.feedback.show(`${groupsWithExercises.length} ${groupsWithExercises.length === 1 ? 'ficha salva' : 'fichas salvas'}. Já estão disponíveis em Fichas salvas.`);
  }
}
