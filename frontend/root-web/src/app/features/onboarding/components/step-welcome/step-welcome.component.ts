import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root-step-welcome',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-welcome.component.html',
  styleUrl: './step-welcome.component.scss',
})
export class StepWelcomeComponent {
  readonly form = input.required<FormGroup>();
}
