import { Injectable, Signal, computed, inject } from '@angular/core';
import { InteractionService } from '../interaction/interaction.service';
import { ScoreService, CategoryScore } from './score.service';
import { RankingService } from './ranking.service';
import { CATEGORIES, Recommendation } from '../../features/dashboard/models/dashboard.models';

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

  readonly result: Signal<RecommendationResult> = computed(() => {
    const history = this.interactions.history();

    if (history.length < MIN_INTERACTIONS_TO_RECOMMEND) {
      return { isLearning: true, primary: null, alternatives: [] };
    }

    const ranked = this.rankingService.rank(this.scoreService.calculate(history));
    const [primaryScore, ...rest] = ranked;

    return {
      isLearning: false,
      primary: this.toRecommendation(primaryScore),
      alternatives: rest.slice(0, 3).map((score) => this.toRecommendation(score)),
    };
  });

  private toRecommendation(score: CategoryScore): Recommendation {
    const category = CATEGORIES[score.categoryId];
    return {
      category,
      title: `${category.label} recomendada`,
      explanation: this.explain(score),
      durationMinutes: 10,
    };
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
