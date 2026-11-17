import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InteractionService } from '../../core/interaction/interaction.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';
import { WorkoutRoutine, WorkoutService } from './workout.service';
import { WorkoutDraft, WorkoutPlanAnswers, WORKOUT_PRESETS, generateWorkoutPlan } from './workout-plans';
import {
  EXPERIENCE_OPTIONS,
  FitnessGoal,
  GOAL_OPTIONS,
  ExperienceLevel,
} from '../onboarding/models/onboarding.models';
import { UserService } from '../../core/user/user.service';

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
  private readonly feedback = inject(ActionFeedbackService);
  private readonly userService = inject(UserService);

  protected readonly routines = this.workouts.routines;
  protected readonly presets = WORKOUT_PRESETS;
  protected readonly goalOptions = GOAL_OPTIONS;
  protected readonly experienceOptions = EXPERIENCE_OPTIONS;
  protected readonly dayOptions = [1, 2, 3, 4, 5, 6, 7];
  protected readonly sessionOptions: readonly (30 | 45 | 60)[] = [30, 45, 60];
  protected readonly activeWorkoutId = signal<string | null>(null);
  protected readonly completedExercises = signal<string[]>([]);
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    exercises: ['', Validators.required],
  });
  protected readonly planForm = this.fb.nonNullable.group({
    goal: [this.userService.profile()?.goal ?? 'general_health', Validators.required],
    daysPerWeek: [this.userService.profile()?.availableDaysPerWeek ?? 3, [Validators.required, Validators.min(1), Validators.max(7)]],
    experienceLevel: [this.userService.profile()?.experienceLevel ?? 'beginner', Validators.required],
    sessionMinutes: [45, Validators.required],
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
    this.feedback.show('Ficha salva. Ela já está disponível em Fichas salvas.');
  }

  protected selectGoal(goal: FitnessGoal): void {
    this.planForm.controls.goal.setValue(goal);
  }

  protected selectDays(days: number): void {
    this.planForm.controls.daysPerWeek.setValue(days);
  }

  protected selectExperience(level: ExperienceLevel): void {
    this.planForm.controls.experienceLevel.setValue(level);
  }

  protected selectDuration(minutes: 30 | 45 | 60): void {
    this.planForm.controls.sessionMinutes.setValue(minutes);
  }

  protected addPreset(preset: WorkoutDraft): void {
    this.workouts.create(preset.name, preset.exercises);
    this.feedback.show(`Ficha “${preset.name}” adicionada aos seus treinos.`);
  }

  protected buildPlan(): void {
    this.planForm.markAllAsTouched();
    if (this.planForm.invalid) return;

    const values = this.planForm.getRawValue();
    const answers: WorkoutPlanAnswers = {
      goal: values.goal as FitnessGoal,
      daysPerWeek: values.daysPerWeek,
      experienceLevel: values.experienceLevel as ExperienceLevel,
      sessionMinutes: values.sessionMinutes as 30 | 45 | 60,
    };
    const plan = generateWorkoutPlan(answers);
    plan.forEach((routine) => this.workouts.create(routine.name, routine.exercises));
    const recoveryNote = values.daysPerWeek > 5 ? ' Separei até dois dias para recuperação.' : '';
    this.feedback.show(`Plano montado com ${plan.length} fichas.${recoveryNote} Você pode revisar e ajustar cada exercício.`);
  }

  protected startWorkout(routine: WorkoutRoutine): void {
    this.activeWorkoutId.set(routine.id);
    this.completedExercises.set([]);
    this.feedback.show(`Treino ${routine.name} iniciado.`);
  }

  protected deleteWorkout(routine: WorkoutRoutine): void {
    const deleted = this.workouts.delete(routine.id);
    if (deleted) this.feedback.show(`Ficha “${deleted.name}” apagada.`);
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
    this.feedback.show(`Treino ${routine.name} concluído. Você ganhou 10 XP.`);
  }
}
