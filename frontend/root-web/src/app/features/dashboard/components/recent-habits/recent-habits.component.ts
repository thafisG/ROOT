import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { HabitLogEntry } from '../../models/dashboard.models';

@Component({
  selector: 'app-root-recent-habits',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-habits.component.html',
  styleUrl: './recent-habits.component.scss',
})
export class RecentHabitsComponent {
  readonly entries = input.required<HabitLogEntry[]>();
  readonly deleteEntry = output<string>();
}
