import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EXPERIENCE_OPTIONS } from '../../models/onboarding.models';

@Component({
  selector: 'app-root-step-routine',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-routine.component.html',
  styleUrl: './step-routine.component.scss',
})
export class StepRoutineComponent {
  readonly form = input.required<FormGroup>();
  protected readonly experienceOptions = EXPERIENCE_OPTIONS;

  protected selectExperience(value: string): void {
    this.form().get('experienceLevel')?.setValue(value);
    this.form().get('experienceLevel')?.markAsTouched();
  }
}
