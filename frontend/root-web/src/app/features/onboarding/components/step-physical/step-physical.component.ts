import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'root-step-physical',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-physical.component.html',
  styleUrl: './step-physical.component.scss',
})
export class StepPhysicalComponent {
  readonly form = input.required<FormGroup>();
}
