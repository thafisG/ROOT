import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { SuggestedActivity } from '../../models/dashboard.models';

@Component({
  selector: 'root-suggested-activities',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './suggested-activities.component.html',
  styleUrl: './suggested-activities.component.scss',
})
export class SuggestedActivitiesComponent {
  readonly activities = input.required<SuggestedActivity[]>();
  readonly selectActivity = output<SuggestedActivity>();
}
