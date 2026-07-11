import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { WeeklyCategoryStat } from '../../models/dashboard.models';

@Component({
  selector: 'root-weekly-summary',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-summary.component.html',
  styleUrl: './weekly-summary.component.scss',
})
export class WeeklySummaryComponent {
  readonly stats = input.required<WeeklyCategoryStat[]>();
}
