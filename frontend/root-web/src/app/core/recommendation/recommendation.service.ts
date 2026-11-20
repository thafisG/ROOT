import { Injectable, Signal, computed, inject } from '@angular/core';
import { InteractionService } from '../interaction/interaction.service';
import { ScoreService, CategoryScore } from './score.service';
import { RankingService } from './ranking.service';
import { CATEGORIES, Recommendation } from '../../features/dashboard/models/dashboard.models';
import { UserService } from '../user/user.service';

export interface RecommendationResult {
  isLearning: boolean;
  primary: Recommendation | null;
  alternatives: Recommendation[];
}

const MIN_INTERACTIONS_TO_RECOMMEND = 3;

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private readonly interactions = inject(InteractionService);
  private readonly scoreService = inject(ScoreService);
  private readonly rankingService = inject(RankingService);
  private readonly userService = inject(UserService);

  readonly result: Signal<RecommendationResult> = computed(() => {
    const history = this.interactions.history();

    const now = Date.now();
    const completedActivities = history.filter((event) => {
      const createdAt = new Date(event.createdAt).getTime();
      return (
        (event.type === 'habit_completed' || event.type === 'workout_completed') &&
        createdAt <= now
      );
    });

    if (completedActivities.length < MIN_INTERACTIONS_TO_RECOMMEND) {
      return { isLearning: true, primary: null, alternatives: [] };
    }

    const profile = this.userService.profile();
    const ranked = this.rankingService.rank(this.scoreService.calculate(history, profile?.goal));
    const [primaryScore, ...rest] = ranked;

    return {
      isLearning: false,
      primary: this.toRecommendation(primaryScore, profile),
      alternatives: rest.slice(0, 3).map((score) => this.toRecommendation(score, profile)),
    };
  });

  private toRecommendation(score: CategoryScore, profile: ReturnType<UserService['profile']>): Recommendation {
    const category = CATEGORIES[score.categoryId];
    return {
      category,
      title: `${category.label} recomendada`,
      explanation: this.explain(score),
      durationMinutes: this.recommendedDuration(category.id, profile),
    };
  }

  private recommendedDuration(
    categoryId: Recommendation['category']['id'],
    profile: ReturnType<UserService['profile']>,
  ): number {
    const baseMinutes: Record<Recommendation['category']['id'], number> = {
      strength: 25,
      mobility: 10,
      hydration: 1,
      sleep: 1,
      nutrition: 5,
      cardio: 15,
    };
    const experienceFactor = profile?.experienceLevel === 'beginner'
      ? 0.8
      : profile?.experienceLevel === 'advanced'
        ? 1.2
        : 1;
    const availabilityFactor = (profile?.availableDaysPerWeek ?? 3) <= 2 ? 0.8 : 1;
    return Math.max(1, Math.round(baseMinutes[categoryId] * experienceFactor * availabilityFactor));
  }

  private explain(score: CategoryScore): string {
    const label = CATEGORIES[score.categoryId].label.toLowerCase();

    if (score.daysSinceLastActivity === null) {
      return `Você ainda não registrou nenhuma atividade de ${label} nos últimos 7 dias.`;
    }

    const days = Math.floor(score.daysSinceLastActivity);
    if (days === 0) {
      return `Você já tem ${score.frequency} registro(s) de ${label} esta semana, mas outras categorias estão mais atrasadas.`;
    }

    return `Fazem ${days} dia(s) desde seu último registro de ${label}.`;
  }
}
