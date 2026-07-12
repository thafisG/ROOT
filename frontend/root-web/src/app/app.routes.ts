import { Routes } from '@angular/router';
import { requireOnboardingGuard, redirectIfOnboardedGuard } from './core/user/onboarding.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'onboarding',
    canActivate: [redirectIfOnboardedGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },

  {
    path: '',
    canActivate: [requireOnboardingGuard],
    loadComponent: () =>
      import('./shared/layout/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'treinos',
        loadComponent: () =>
          import('./shared/ui/placeholder-page/placeholder-page.component').then(
            (m) => m.PlaceholderPageComponent,
          ),
        data: { title: 'Treinos', description: 'A biblioteca de treinos chega na próxima fase.' },
      },
      {
        path: 'recomendacoes',
        loadComponent: () =>
          import('./shared/ui/placeholder-page/placeholder-page.component').then(
            (m) => m.PlaceholderPageComponent,
          ),
        data: {
          title: 'Recomendações',
          description: 'O histórico completo de recomendações chega na próxima fase.',
        },
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./shared/ui/placeholder-page/placeholder-page.component').then(
            (m) => m.PlaceholderPageComponent,
          ),
        data: {
          title: 'Analytics',
          description: 'Relatórios de equilíbrio chegam na próxima fase.',
        },
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./shared/ui/placeholder-page/placeholder-page.component').then(
            (m) => m.PlaceholderPageComponent,
          ),
        data: { title: 'Perfil', description: 'Edição de perfil chega na próxima fase.' },
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
