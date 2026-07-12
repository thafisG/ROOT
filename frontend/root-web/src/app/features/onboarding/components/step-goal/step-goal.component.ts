import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { GOAL_OPTIONS } from '../../models/onboarding.models';

@Component({
  selector: 'app-root-step-goal',
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-goal.component.html',
  styleUrl: './step-goal.component.scss',
})
export class StepGoalComponent {
  readonly form = input.required<FormGroup>();
  protected readonly options = GOAL_OPTIONS;

  protected select(value: string): void {
    this.form().get('goal')?.setValue(value);
    this.form().get('goal')?.markAsTouched();
  }
}
