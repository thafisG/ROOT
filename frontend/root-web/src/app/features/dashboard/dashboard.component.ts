import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { GreetingHeaderComponent } from './components/greeting-header/greeting-header.component';
import { RecommendationCardComponent } from './components/recommendation-card/recommendation-card.component';
import { NextWorkoutCardComponent } from './components/next-workout-card/next-workout-card.component';
import { WeeklySummaryComponent } from './components/weekly-summary/weekly-summary.component';
import { RecentHabitsComponent } from './components/recent-habits/recent-habits.component';
import { SuggestedActivitiesComponent } from './components/suggested-activities/suggested-activities.component';
import { InteractionService } from '../../core/interaction/interaction.service';
import { RecommendationService } from '../../core/recommendation/recommendation.service';
import {
  CATEGORIES,
  HabitCategoryId,
  HabitLogEntry,
  InteractionEvent,
  NextWorkout,
  Recommendation,
  SuggestedActivity,
  WeeklyCategoryStat,
} from './models/dashboard.models';

@Component({
  selector: 'root-dashboard',
  imports: [
    IconComponent,
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
  private readonly interactionService = inject(InteractionService);
  private readonly recommendationService = inject(RecommendationService);

  protected readonly userName = signal('Marina');
  protected readonly showAlternatives = signal(false);

  protected readonly recommendationState = this.recommendationService.result;

  protected readonly streakDays = computed(() =>
    this.calculateStreak(this.interactionService.history()),
  );

  protected readonly nextWorkout = signal<NextWorkout>({
    category: CATEGORIES.mobility,
    name: 'Mobilidade completa — corpo todo',
    scheduledLabel: 'Hoje, 18:30',
    durationMinutes: 25,
    level: 'Intermediário',
    exerciseCount: 8,
  });

  protected readonly suggestedActivities = signal<SuggestedActivity[]>([
    { id: 'a1', category: CATEGORIES.mobility, title: 'Alongamento matinal', durationMinutes: 8 },
    { id: 'a2', category: CATEGORIES.hydration, title: 'Registrar hidratação', durationMinutes: 1 },
    { id: 'a3', category: CATEGORIES.nutrition, title: 'Planejar refeições', durationMinutes: 5 },
    { id: 'a4', category: CATEGORIES.sleep, title: 'Registrar sono da noite', durationMinutes: 1 },
    { id: 'a5', category: CATEGORIES.cardio, title: 'Caminhada leve', durationMinutes: 15 },
  ]);

  protected readonly weeklyStats = computed<WeeklyCategoryStat[]>(() => {
    const history = this.interactionService.history();
    const windowStart = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return (Object.keys(CATEGORIES) as HabitCategoryId[]).map((id) => {
      const count = history.filter(
        (e) =>
          e.category === id &&
          (e.type === 'habit_completed' || e.type === 'workout_completed') &&
          new Date(e.createdAt).getTime() >= windowStart,
      ).length;

      return { category: CATEGORIES[id], percentage: Math.min(100, count * 20) };
    });
  });

  protected readonly recentHabits = computed<HabitLogEntry[]>(() =>
    this.interactionService.recentEntries(5).map((event) => ({
      id: event.id,
      category: CATEGORIES[event.category],
      label: this.describeEvent(event),
      timeLabel: this.formatRelativeTime(event.createdAt),
    })),
  );

  protected onAcceptRecommendation(recommendation: Recommendation): void {
    this.interactionService.register('recommendation_clicked', recommendation.category.id);
    this.interactionService.register('habit_completed', recommendation.category.id);
    this.showAlternatives.set(false);
  }

  protected onDismissRecommendation(recommendation: Recommendation): void {
    this.interactionService.register('recommendation_dismissed', recommendation.category.id);
  }

  protected onToggleAlternatives(): void {
    this.showAlternatives.update((value) => !value);
  }

  protected onSelectAlternative(recommendation: Recommendation): void {
    this.interactionService.register('recommendation_clicked', recommendation.category.id);
    this.interactionService.register('habit_completed', recommendation.category.id);
    this.showAlternatives.set(false);
  }

  protected onCompleteWorkout(): void {
    this.interactionService.register('workout_completed', this.nextWorkout().category.id);
  }

  protected onSelectActivity(activity: SuggestedActivity): void {
    this.interactionService.register('habit_completed', activity.category.id);
  }

  private calculateStreak(history: InteractionEvent[]): number {
    const activityDates = new Set(
      history
        .filter((e) => e.type === 'habit_completed' || e.type === 'workout_completed')
        .map((e) => new Date(e.createdAt).toDateString()),
    );

    let streak = 0;
    const cursor = new Date();

    while (activityDates.has(cursor.toDateString())) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  private formatRelativeTime(iso: string): string {
    const date = new Date(iso);
    const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);

    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `Há ${diffMinutes} min`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
      return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    return date.toLocaleDateString('pt-BR');
  }

  private describeEvent(event: InteractionEvent): string {
    const label = CATEGORIES[event.category].label.toLowerCase();
    switch (event.type) {
      case 'workout_completed':
        return `Treino de ${label} concluído`;
      case 'habit_completed':
        return `Hábito de ${label} registrado`;
      case 'recommendation_clicked':
        return `Recomendação de ${label} aceita`;
      default:
        return `${label} atualizado`;
    }
  }
}
