import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'home'
  | 'dumbbell'
  | 'sparkles'
  | 'chart'
  | 'user'
  | 'droplet'
  | 'moon'
  | 'flame'
  | 'leaf'
  | 'apple'
  | 'chevron-right'
  | 'check'
  | 'x'
  | 'clock';

@Component({
  selector: 'app-root-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
}

