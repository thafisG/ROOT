import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../ui/icon/icon.component';
import {
  NavItem,
  PRIMARY_NAV_ITEMS,
} from '../../../features/dashboard/models/dashboard.models';

@Component({
  selector: 'root-bottom-nav',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  readonly items = input<NavItem[]>(PRIMARY_NAV_ITEMS);
  readonly activeRoute = input('/dashboard');
}
