import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'root-greeting-header',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './greeting-header.component.html',
  styleUrl: './greeting-header.component.scss',
})
export class GreetingHeaderComponent {
  readonly userName = input.required<string>();
  readonly streakDays = input<number>(0);

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  });
}
