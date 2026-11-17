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

  protected readonly routineForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });
  protected readonly exerciseForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    sets: [3, [Validators.required, Validators.min(1), Validators.max(20)]],
    repetitions: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
    restSeconds: [60, [Validators.required, Validators.min(0), Validators.max(300)]],
  });
  protected readonly exercises = signal<WorkoutExerciseDraft[]>([]);
  protected readonly referenceImage = signal<string | null>(null);
  protected readonly exerciseError = signal('');
  protected readonly progress = computed(() => Math.min(100, Math.round((this.exercises().length / 3) * 100)));
  protected readonly progressLabel = computed(() => {
    const count = this.exercises().length;
    if (count === 0) return 'Comece adicionando seu primeiro exercício';
    if (count < 3) return `Boa! Mais ${3 - count} para completar sua ficha`;
    return 'Ficha pronta para salvar';
  });

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
      { id: crypto.randomUUID(), ...this.exerciseForm.getRawValue() },
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
    this.exerciseError.set('');
  }

  protected addImportedExercises(imported: WorkoutExerciseDraft[]): void {
    if (!imported.length) return;
    const remaining = Math.max(0, 20 - this.exercises().length);
    const added = imported.slice(0, remaining);
    this.exercises.update((items) => [...items, ...added]);
    if (added.length < imported.length) this.exerciseError.set('A ficha aceita até 20 exercícios; alguns itens não foram adicionados.');
    this.feedback.show(`${added.length} exercícios importados. Confira e ajuste a ficha.`);
  }

  protected saveRoutine(): void {
    this.routineForm.markAllAsTouched();
    this.exerciseError.set('');
    if (this.routineForm.invalid) return;
    if (!this.exercises().length) {
      this.exerciseError.set('Adicione pelo menos um exercício antes de salvar.');
      return;
    }

    const exerciseList = this.exercises().map((item) =>
      `${item.name.trim()} — ${item.sets}×${item.repetitions}${item.restSeconds ? ` — descanso ${item.restSeconds}s` : ''}`,
    );
    this.workouts.create(this.routineForm.controls.name.value, exerciseList, this.referenceImage());
    this.routineForm.reset();
    this.exerciseForm.reset({ name: '', sets: 3, repetitions: 10, restSeconds: 60 });
    this.exercises.set([]);
    this.referenceImage.set(null);
    this.feedback.show('Ficha salva. Ela já está disponível em Fichas salvas.');
  }
}
