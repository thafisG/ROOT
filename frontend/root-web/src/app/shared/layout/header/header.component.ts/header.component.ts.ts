import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../ui/icon/icon.component';

@Component({
  selector: 'app-root-app-header',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly userInitials = input<string>('MT');
}
