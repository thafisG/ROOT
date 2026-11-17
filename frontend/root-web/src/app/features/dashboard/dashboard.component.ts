import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { GreetingHeaderComponent } from './components/greeting-header/greeting-header.component';
import { GamificationSummaryComponent } from './components/gamification-summary/gamification-summary.component';
import { RecommendationCardComponent } from './components/recommendation-card/recommendation-card.component';
import { WeeklySummaryComponent } from './components/weekly-summary/weekly-summary.component';
import { RecentHabitsComponent } from './components/recent-habits/recent-habits.component';
import { SuggestedActivitiesComponent } from './components/suggested-activities/suggested-activities.component';
import { InteractionService } from '../../core/interaction/interaction.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';
import { calculateActivityStreak } from '../../core/interaction/activity-metrics';
import { RecommendationService } from '../../core/recommendation/recommendation.service';
import { UserService } from '../../core/user/user.service';
import {
  CATEGORIES,
  HabitCategoryId,
  HabitLogEntry,
  InteractionEvent,
  Recommendation,
  SuggestedActivity,
  WeeklyCategoryStat,
} from './models/dashboard.models';

@Component({
  selector: 'app-root-dashboard',
  imports: [
    IconComponent,
    RouterLink,
    GreetingHeaderComponent,
    GamificationSummaryComponent,
    RecommendationCardComponent,
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
  private readonly feedback = inject(ActionFeedbackService);
  private readonly recommendationService = inject(RecommendationService);
  private readonly userService = inject(UserService);

  protected readonly showAlternatives = signal(false);
  protected readonly activeRecommendation = signal<Recommendation | null>(null);
  protected readonly activeSuggestedActivity = signal<SuggestedActivity | null>(null);

  protected readonly userName = computed(() => this.userService.profile()?.name ?? 'Visitante');

  protected readonly recommendationState = this.recommendationService.result;

  protected readonly streakDays = computed(() =>
    calculateActivityStreak(this.interactionService.history()),
  );

  protected readonly experiencePoints = this.interactionService.experiencePoints;

  protected readonly suggestedActivities = computed<SuggestedActivity[]>(() => {
    const activityDetails: Record<HabitCategoryId, { title: string; durationMinutes: number }> = {
      strength: { title: 'Fazer um treino de força', durationMinutes: 25 },
      mobility: { title: 'Fazer alongamento', durationMinutes: 8 },
      hydration: { title: 'Registrar sua hidratação', durationMinutes: 1 },
      sleep: { title: 'Registrar seu sono', durationMinutes: 1 },
      nutrition: { title: 'Registrar uma refeição', durationMinutes: 2 },
      cardio: { title: 'Fazer uma caminhada leve', durationMinutes: 15 },
    };
    const history = this.interactionService.history();
    const now = Date.now();
    const weekStart = now - 7 * 24 * 60 * 60 * 1000;
    const frequency = new Map<HabitCategoryId, number>();

    for (const id of Object.keys(CATEGORIES) as HabitCategoryId[]) frequency.set(id, 0);
    for (const event of history) {
      if (
        (event.type === 'habit_completed' || event.type === 'workout_completed') &&
        new Date(event.createdAt).getTime() >= weekStart && new Date(event.createdAt).getTime() <= now
      ) {
        frequency.set(event.category, (frequency.get(event.category) ?? 0) + 1);
      }
    }

    return [...frequency.entries()]
      .sort(([aId, aCount], [bId, bCount]) => aCount - bCount || aId.localeCompare(bId))
      .slice(0, 5)
      .map(([id]) => ({ id, category: CATEGORIES[id], ...activityDetails[id] }));
  });

  protected readonly weeklyStats = computed<WeeklyCategoryStat[]>(() => {
    const history = this.interactionService.history();
    const now = Date.now();
    const windowStart = now - 7 * 24 * 60 * 60 * 1000;

    return (Object.keys(CATEGORIES) as HabitCategoryId[]).map((id) => {
      const count = history.filter(
        (e) =>
          e.category === id &&
          (e.type === 'habit_completed' || e.type === 'workout_completed') &&
          new Date(e.createdAt).getTime() >= windowStart && new Date(e.createdAt).getTime() <= now,
      ).length;

      return { category: CATEGORIES[id], count };
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
    this.activeRecommendation.set(recommendation);
    this.showAlternatives.set(false);
    this.feedback.show(`Recomendação de ${recommendation.category.label.toLowerCase()} iniciada. Marque como concluída ao terminar.`);
  }

  protected onCompleteRecommendation(): void {
    const recommendation = this.activeRecommendation();
    if (!recommendation) return;

    this.interactionService.register('habit_completed', recommendation.category.id);
    this.activeRecommendation.set(null);
    this.feedback.show('Atividade concluída. Você ganhou 10 XP.');
  }

  protected onDismissRecommendation(recommendation: Recommendation): void {
    this.interactionService.register('recommendation_dismissed', recommendation.category.id);
    this.feedback.show('Recomendação dispensada. Vou considerar sua escolha nas próximas sugestões.');
  }

  protected onToggleAlternatives(): void {
    this.showAlternatives.update((value) => !value);
  }

  protected onSelectAlternative(recommendation: Recommendation): void {
    this.onAcceptRecommendation(recommendation);
  }

  protected onSelectActivity(activity: SuggestedActivity): void {
    this.interactionService.register('recommendation_clicked', activity.category.id);
    this.activeSuggestedActivity.set(activity);
    this.feedback.show(`${activity.title} iniciada. Marque como concluída ao terminar.`);
  }

  protected onCompleteSuggestedActivity(): void {
    const activity = this.activeSuggestedActivity();
    if (!activity) return;

    this.interactionService.register('habit_completed', activity.category.id);
    this.activeSuggestedActivity.set(null);
    this.feedback.show('Atividade concluída. Você ganhou 10 XP.');
  }

  protected onDeleteActivity(id: string): void {
    const deleted = this.interactionService.deleteEvent(id);
    if (!deleted) return;

    const wasCompleted = deleted.type === 'habit_completed' || deleted.type === 'workout_completed';
    this.feedback.show(
      wasCompleted
        ? 'Registro apagado. Os 10 XP dessa atividade também foram removidos.'
        : 'Ação apagada do histórico.',
    );
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
        return event.details ? `Treino ${event.details} concluído` : `Treino de ${label} concluído`;
      case 'habit_completed':
        return event.details ? event.details : `Hábito de ${label} registrado`;
      case 'recommendation_clicked':
        return `Recomendação de ${label} aceita`;
      default:
        return `${label} atualizado`;
    }
  }
}
