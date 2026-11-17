import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { WeeklyCategoryStat } from '../../models/dashboard.models';

@Component({
  selector: 'app-root-weekly-summary',
  imports: [IconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-summary.component.html',
  styleUrl: './weekly-summary.component.scss',
})
export class WeeklySummaryComponent {
  readonly stats = input.required<WeeklyCategoryStat[]>();
}
