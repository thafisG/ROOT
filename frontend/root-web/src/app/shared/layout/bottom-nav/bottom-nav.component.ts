import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { NavItem, PRIMARY_NAV_ITEMS } from '../../../features/dashboard/models/dashboard.models';

@Component({
  selector: 'root-bottom-nav',
  imports: [IconComponent, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  readonly items = input<NavItem[]>(PRIMARY_NAV_ITEMS);
}
