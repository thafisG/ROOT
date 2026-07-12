import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { Recommendation } from '../../models/dashboard.models';

@Component({
  selector: 'app-root-recommendation-card',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recommendation-card.component.html',
  styleUrl: './recommendation-card.component.scss',
})
export class RecommendationCardComponent {
  readonly recommendation = input.required<Recommendation>();

  readonly accept = output<void>();
  readonly viewAlternatives = output<void>();
  readonly dismiss = output<void>();
}
