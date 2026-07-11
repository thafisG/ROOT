import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BottomNavComponent } from '../../shared/layout/bottom-nav/bottom-nav.component';
import { GreetingHeaderComponent } from './components/greeting-header/greeting-header.component';
import { RecommendationCardComponent } from './components/recommendation-card/recommendation-card.component';
import { NextWorkoutCardComponent } from './components/next-workout-card/next-workout-card.component';
import { WeeklySummaryComponent } from './components/weekly-summary/weekly-summary.component';
import { RecentHabitsComponent } from './components/recent-habits/recent-habits.component';
import { SuggestedActivitiesComponent } from './components/suggested-activities/suggested-activities.component';
import {
  CATEGORIES,
  HabitLogEntry,
  NextWorkout,
  Recommendation,
  SuggestedActivity,
  WeeklyCategoryStat,
} from './models/dashboard.models';
import { HeaderComponent } from '../../shared/layout/header/header.component.ts/header.component.ts';
import { SidebarNavComponent } from '../../shared/layout/sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'root-dashboard',
  imports: [
    HeaderComponent,
    SidebarNavComponent,
    BottomNavComponent,
    GreetingHeaderComponent,
    RecommendationCardComponent,
    NextWorkoutCardComponent,
    WeeklySummaryComponent,
    RecentHabitsComponent,
    SuggestedActivitiesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // Dados mockados — em produção, viriam do RecommendationService / InteractionService (Fase 3).
  protected readonly userName = signal('Marina');
  protected readonly streakDays = signal(5);

  protected readonly recommendation = signal<Recommendation>({
    category: CATEGORIES.mobility,
    title: 'Mobilidade recomendada',
    explanation: 'Você treinou força por 5 dias consecutivos e ainda não fez mobilidade esta semana.',
    durationMinutes: 10,
  });

  protected readonly nextWorkout = signal<NextWorkout>({
    name: 'Mobilidade completa — corpo todo',
    scheduledLabel: 'Hoje, 18:30',
    durationMinutes: 25,
    level: 'Intermediário',
    exerciseCount: 8,
  });

  protected readonly weeklyStats = signal<WeeklyCategoryStat[]>([
    { category: CATEGORIES.strength, percentage: 90 },
    { category: CATEGORIES.cardio, percentage: 45 },
    { category: CATEGORIES.hydration, percentage: 60 },
    { category: CATEGORIES.mobility, percentage: 10 },
    { category: CATEGORIES.sleep, percentage: 70 },
    { category: CATEGORIES.nutrition, percentage: 55 },
  ]);

  protected readonly recentHabits = signal<HabitLogEntry[]>([
    { id: '1', category: CATEGORIES.strength, label: 'Treino de força concluído', timeLabel: 'Hoje, 07:20' },
    { id: '2', category: CATEGORIES.hydration, label: '500ml de água registrados', timeLabel: 'Hoje, 09:10' },
    { id: '3', category: CATEGORIES.sleep, label: '7h40 de sono registradas', timeLabel: 'Ontem, 23:15' },
  ]);

  protected readonly suggestedActivities = signal<SuggestedActivity[]>([
    { id: 'a1', category: CATEGORIES.mobility, title: 'Alongamento matinal', durationMinutes: 8 },
    { id: 'a2', category: CATEGORIES.hydration, title: 'Lembrete de hidratação', durationMinutes: 1 },
    { id: 'a3', category: CATEGORIES.nutrition, title: 'Planejar refeições', durationMinutes: 5 },
  ]);

  protected onAcceptRecommendation(): void {
    // RF-05: registrar sinal positivo e redirecionar para execução (InteractionService).
  }

  protected onViewAlternatives(): void {
    // RF-03: navegar para a lista de recomendações alternativas.
  }

  protected onDismissRecommendation(): void {
    // RF-04: registrar sinal fraco negativo (InteractionService).
  }

  protected onViewWorkout(): void {
    // Navegar para o detalhe do treino (feature Workouts).
  }

  protected onSelectActivity(activity: SuggestedActivity): void {
    // Encaminhar para o fluxo de execução/registro da categoria correspondente.
  }
}
