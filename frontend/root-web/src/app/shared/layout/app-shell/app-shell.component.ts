import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { HeaderComponent } from '../header/header.component.ts/header.component.ts';

@Component({
  selector: 'app-root-app-shell',
  imports: [RouterOutlet, HeaderComponent, SidebarNavComponent, BottomNavComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {}
