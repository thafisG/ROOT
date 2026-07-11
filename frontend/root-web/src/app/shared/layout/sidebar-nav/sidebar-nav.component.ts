import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../ui/icon/icon.component';
import {
  NavItem,
  PRIMARY_NAV_ITEMS,
} from '../../../features/dashboard/models/dashboard.models';

@Component({
  selector: 'root-sidebar-nav',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavComponent {
  readonly items = input<NavItem[]>(PRIMARY_NAV_ITEMS);
  readonly activeRoute = input('/dashboard');
}
