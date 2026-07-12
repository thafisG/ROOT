import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from './shared/layout/sidebar-nav/sidebar-nav.component';
import { BottomNavComponent } from './shared/layout/bottom-nav/bottom-nav.component';
import { HeaderComponent } from './shared/layout/header/header.component.ts/header.component.ts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarNavComponent, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
