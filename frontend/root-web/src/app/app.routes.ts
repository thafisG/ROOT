import { Routes } from '@angular/router';
import { requireOnboardingGuard, redirectIfOnboardedGuard } from './core/user/onboarding.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },

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
          import('./features/workouts/workouts.component').then((m) => m.WorkoutsComponent),
      },
      {
        path: 'nutricao',
        loadComponent: () =>
          import('./features/nutrition/nutrition.component').then((m) => m.NutritionComponent),
      },
      {
        path: 'acompanhamento',
        loadComponent: () =>
          import('./features/coaching/coaching.component').then((m) => m.CoachingComponent),
      },
      {
        path: 'recomendacoes',
        loadComponent: () =>
          import('./features/recommendations/recommendations.component').then(
            (m) => m.RecommendationsComponent,
          ),
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
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
