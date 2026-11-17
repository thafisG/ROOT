import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InteractionService } from '../../core/interaction/interaction.service';
import { WorkoutRoutine, WorkoutService } from './workout.service';

@Component({
  selector: 'app-root-workouts',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly workouts = inject(WorkoutService);
  private readonly interactions = inject(InteractionService);

  protected readonly routines = this.workouts.routines;
  protected readonly activeWorkoutId = signal<string | null>(null);
  protected readonly completedExercises = signal<string[]>([]);
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    exercises: ['', Validators.required],
  });
  protected readonly activeWorkout = computed(
    () => this.routines().find((routine) => routine.id === this.activeWorkoutId()) ?? null,
  );

  protected createWorkout(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const exercises = this.form.controls.exercises.value
      .split('\n')
      .map((exercise) => exercise.trim())
      .filter(Boolean);
    if (exercises.length === 0) return;

    this.workouts.create(this.form.controls.name.value, exercises);
    this.form.reset();
  }

  protected startWorkout(routine: WorkoutRoutine): void {
    this.activeWorkoutId.set(routine.id);
    this.completedExercises.set([]);
  }

  protected toggleExercise(exercise: string): void {
    this.completedExercises.update((completed) =>
      completed.includes(exercise)
        ? completed.filter((item) => item !== exercise)
        : [...completed, exercise],
    );
  }

  protected finishWorkout(): void {
    const routine = this.activeWorkout();
    if (!routine || this.completedExercises().length !== routine.exercises.length) return;

    this.interactions.register('workout_completed', 'strength', routine.name);
    this.activeWorkoutId.set(null);
    this.completedExercises.set([]);
  }
}
