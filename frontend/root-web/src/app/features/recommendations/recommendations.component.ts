import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { InteractionService } from '../../core/interaction/interaction.service';
import { CATEGORIES, InteractionEvent } from '../dashboard/models/dashboard.models';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';

interface RecommendationHistoryEntry extends InteractionEvent {
  categoryLabel: string;
  statusLabel: string;
  dateLabel: string;
}

@Component({
  selector: 'app-root-recommendations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
})
export class RecommendationsComponent {
  private readonly interactions = inject(InteractionService);
  private readonly feedback = inject(ActionFeedbackService);

  protected readonly history = computed<RecommendationHistoryEntry[]>(() =>
    this.interactions
      .history()
      .filter(
        (event) =>
          event.type === 'recommendation_clicked' ||
          event.type === 'recommendation_dismissed' ||
          event.type === 'habit_completed' ||
          event.type === 'workout_completed',
      )
      .map((event) => ({
        ...event,
        categoryLabel: CATEGORIES[event.category].label,
        statusLabel: this.statusLabel(event),
        dateLabel: this.formatDate(event.createdAt),
      })),
  );

  protected readonly startedCount = computed(
    () => this.history().filter((event) => event.type === 'recommendation_clicked').length,
  );

  protected readonly dismissedCount = computed(
    () => this.history().filter((event) => event.type === 'recommendation_dismissed').length,
  );

  protected readonly completedCount = computed(
    () =>
      this.history().filter(
        (event) => event.type === 'habit_completed' || event.type === 'workout_completed',
      ).length,
  );

  protected deleteEntry(entry: InteractionEvent): void {
    const removed = this.interactions.deleteEvent(entry.id);
    if (!removed) return;

    const wasCompleted = removed.type === 'habit_completed' || removed.type === 'workout_completed';
    this.feedback.show(
      wasCompleted
        ? 'Atividade removida do histórico. Os 10 XP também foram retirados.'
        : 'Ação removida do histórico.',
    );
  }

  private statusLabel(event: InteractionEvent): string {
    switch (event.type) {
      case 'recommendation_clicked':
        return 'Iniciada';
      case 'recommendation_dismissed':
        return 'Dispensada';
      case 'workout_completed':
        return 'Treino concluído';
      case 'habit_completed':
        return 'Atividade concluída';
    }
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'Data indisponível'
      : date.toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' });
  }
}
