import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingHeroComponent } from './components/onboarding-hero/onboarding-hero.component';
import { OnboardingProgressComponent } from './components/onboarding-progress/onboarding-progress.component';
import { StepWelcomeComponent } from './components/step-welcome/step-welcome.component';
import { StepGoalComponent } from './components/step-goal/step-goal.component';
import { StepRoutineComponent } from './components/step-routine/step-routine.component';
import { StepSummaryComponent } from './components/step-summary/step-summary.component';
import { UserService } from '../../core/user/user.service';
import { ONBOARDING_STEP_LABELS, UserProfile } from './models/onboarding.models';

const STEP_FIELDS: string[][] = [
  ['name', 'email'],
  ['goal'],
  ['experienceLevel', 'availableDaysPerWeek'],
  [],
];

@Component({
  selector: 'app-root-onboarding',
  imports: [
    ReactiveFormsModule,
    OnboardingHeroComponent,
    OnboardingProgressComponent,
    StepWelcomeComponent,
    StepGoalComponent,
    StepRoutineComponent,
    StepSummaryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly stepLabels = ONBOARDING_STEP_LABELS;
  protected readonly currentStep = signal(0);
  protected readonly lastStepIndex = STEP_FIELDS.length - 1;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    goal: ['', Validators.required],
    experienceLevel: ['', Validators.required],
    availableDaysPerWeek: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
  });

  protected next(): void {
    const fields = STEP_FIELDS[this.currentStep()];
    fields.forEach((field) => this.form.get(field)?.markAsTouched());

    const isStepValid = fields.every((field) => this.form.get(field)?.valid);
    if (!isStepValid) return;

    if (this.currentStep() < this.lastStepIndex) {
      this.currentStep.update((step) => step + 1);
    } else {
      this.confirm();
    }
  }

  protected back(): void {
    this.currentStep.update((step) => Math.max(0, step - 1));
  }

  private confirm(): void {
    const value = this.form.getRawValue();

    const profile: UserProfile = {
      name: value.name!,
      email: value.email!,
      goal: value.goal as UserProfile['goal'],
      experienceLevel: value.experienceLevel as UserProfile['experienceLevel'],
      availableDaysPerWeek: value.availableDaysPerWeek!,
      createdAt: new Date().toISOString(),
    };

    this.userService.saveProfile(profile);
    this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }
}
