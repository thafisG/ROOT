import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GOAL_OPTIONS, EXPERIENCE_OPTIONS } from '../../models/onboarding.models';

@Component({
  selector: 'app-root-step-summary',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-summary.component.html',
  styleUrl: './step-summary.component.scss',
})
export class StepSummaryComponent {
  readonly name = input.required<string>();
  readonly goal = input.required<string>();
  readonly experienceLevel = input.required<string>();
  readonly availableDaysPerWeek = input.required<number>();
  readonly replacingProfile = input(false);
  readonly form = input.required<FormGroup>();

  protected goalLabel(value: string): string {
    return GOAL_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }

  protected experienceLabel(value: string): string {
    return EXPERIENCE_OPTIONS.find((option) => option.value === value)?.label ?? value;
  }
}
