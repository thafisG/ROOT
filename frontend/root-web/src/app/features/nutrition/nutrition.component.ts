import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InteractionService } from '../../core/interaction/interaction.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';
import { InteractionEvent } from '../dashboard/models/dashboard.models';

@Component({
  selector: 'app-root-nutrition',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.scss',
})
export class NutritionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly interactions = inject(InteractionService);
  private readonly feedback = inject(ActionFeedbackService);

  protected readonly history = this.interactions.history;
  protected readonly nutritionEntries = computed(() =>
    this.history().filter((event) => this.isNutritionEntry(event)),
  );
  protected readonly mealForm = this.fb.nonNullable.group({ meal: ['', [Validators.required, Validators.maxLength(120)]] });
  protected readonly waterGlassesToday = computed(() => {
    const now = new Date();
    return this.history().filter((event) => {
      const date = new Date(event.createdAt);
      return (
        event.type === 'habit_completed' &&
        event.category === 'hydration' &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    }).length;
  });

  protected logWater(): void {
    this.interactions.register('habit_completed', 'hydration', 'Um copo de água registrado');
    this.feedback.show('Copo de água registrado. Você ganhou 10 XP.');
  }

  protected logMeal(): void {
    this.mealForm.markAllAsTouched();
    if (this.mealForm.invalid) return;

    this.interactions.register(
      'habit_completed',
      'nutrition',
      `Refeição registrada: ${this.mealForm.controls.meal.value.trim()}`,
    );
    this.mealForm.reset();
    this.feedback.show('Refeição registrada. Você ganhou 10 XP.');
  }

  protected isNutritionEntry(event: InteractionEvent): boolean {
    return (
      event.type === 'habit_completed' &&
      (event.category === 'hydration' || event.category === 'nutrition') &&
      !!event.details
    );
  }

  protected formatDate(value: string): string {
    return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  protected deleteEntry(id: string): void {
    if (this.interactions.deleteEvent(id)) this.feedback.show('Registro de nutrição apagado do histórico.');
  }
}
