import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'root-step-welcome',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-welcome.component.html',
  styleUrl: './step-welcome.component.scss',
})
export class StepWelcomeComponent {
  readonly form = input.required<FormGroup>();
}
