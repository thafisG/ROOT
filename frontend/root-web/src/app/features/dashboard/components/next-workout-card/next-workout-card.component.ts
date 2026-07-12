import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { NextWorkout } from '../../models/dashboard.models';

@Component({
  selector: 'root-next-workout-card',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './next-workout-card.component.html',
  styleUrl: './next-workout-card.component.scss',
})
export class NextWorkoutCardComponent {
  readonly workout = input.required<NextWorkout>();
  readonly complete = output<void>();
}
