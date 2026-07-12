import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { NavItem, PRIMARY_NAV_ITEMS } from '../../../features/dashboard/models/dashboard.models';

@Component({
  selector: 'root-sidebar-nav',
  imports: [IconComponent, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  readonly items = input<NavItem[]>(PRIMARY_NAV_ITEMS);
}
