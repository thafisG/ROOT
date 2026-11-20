import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InteractionService } from '../../core/interaction/interaction.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';
import { CATEGORIES, InteractionEvent } from '../dashboard/models/dashboard.models';
import { GuidedActivity, GuidedActivityModalComponent } from '../../shared/ui/guided-activity-modal/guided-activity-modal.component';
import {
  NutritionMealType,
  NutritionPlanMeal,
  NutritionPlanSource,
  NutritionService,
} from './nutrition.service';

const MEAL_TYPES: { value: NutritionMealType; label: string }[] = [
  { value: 'breakfast', label: 'Café da manhã' },
  { value: 'lunch', label: 'Almoço' },
  { value: 'snack', label: 'Lanche' },
  { value: 'dinner', label: 'Jantar' },
];

const MEAL_IDEAS: { title: string; type: NutritionMealType; description: string }[] = [
  { title: 'Café da manhã variado', type: 'breakfast', description: 'Fruta da estação, aveia e iogurte natural ou outra combinação que faça sentido para você.' },
  { title: 'Almoço com variedade', type: 'lunch', description: 'Arroz e feijão, legumes ou verduras e uma fonte de proteína de sua preferência.' },
  { title: 'Lanche prático', type: 'snack', description: 'Fruta com iogurte, castanhas ou outro alimento que você já goste.' },
  { title: 'Jantar simples', type: 'dinner', description: 'Uma refeição caseira com alimentos que você costuma consumir e tem disponíveis.' },
];

@Component({
  selector: 'app-root-nutrition',
  imports: [ReactiveFormsModule, RouterLink, GuidedActivityModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.scss',
})
export class NutritionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly interactions = inject(InteractionService);
  private readonly feedback = inject(ActionFeedbackService);
  private readonly nutrition = inject(NutritionService);

  protected readonly history = this.interactions.history;
  protected readonly mealTypes = MEAL_TYPES;
  protected readonly mealIdeas = MEAL_IDEAS;
  protected readonly plans = this.nutrition.plans;
  protected readonly nutritionEntries = computed(() =>
    this.history().filter((event) => this.isNutritionEntry(event)),
  );
  protected readonly mealForm = this.fb.nonNullable.group({
    type: ['breakfast' as NutritionMealType, Validators.required],
    description: ['', [Validators.required, Validators.maxLength(160)]],
  });
  protected readonly planForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    source: ['personal' as 'personal' | 'professional', Validators.required],
    mealType: ['breakfast' as NutritionMealType, Validators.required],
    mealDescription: ['', [Validators.required, Validators.maxLength(220)]],
  });
  protected readonly planMeals = signal<NutritionPlanMeal[]>([]);
  protected readonly activeActivity = signal<GuidedActivity | null>(null);
  protected readonly planError = signal('');
  protected readonly dailyMealCount = computed(() => {
    const today = new Date();
    return this.history().filter((event) => {
      if (event.type !== 'habit_completed' || event.category !== 'nutrition') return false;
      const date = new Date(event.createdAt);
      return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
    }).length;
  });
  protected readonly mealProgress = computed(() => Math.min(100, Math.round(this.dailyMealCount() / 3 * 100)));
  protected readonly mealProgressLabel = computed(() => {
    const count = this.dailyMealCount();
    return count === 0 ? 'Comece com a primeira refeição' : count < 3 ? `Boa! Mais ${3 - count} registros para completar o marco` : 'Marco diário alcançado';
  });
  protected readonly waterGlassesToday = computed(() => {
    const now = new Date();
    return this.history().filter((event) => {
      const date = new Date(event.createdAt);
      return event.type === 'habit_completed' && event.category === 'hydration' &&
        date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    }).length;
  });

  protected logWater(): void {
    this.activeActivity.set({ category: CATEGORIES.hydration, title: 'Registrar um copo de água', durationMinutes: 1 });
  }

  protected selectMealType(type: NutritionMealType): void {
    this.mealForm.controls.type.setValue(type);
  }

  protected logMeal(): void {
    this.mealForm.markAllAsTouched();
    if (this.mealForm.invalid) return;

    const { type, description } = this.mealForm.getRawValue();
    const label = this.mealTypes.find((item) => item.value === type)?.label ?? 'Refeição';
    this.activeActivity.set({
      category: CATEGORIES.nutrition,
      title: 'Registrar uma refeição',
      durationMinutes: 1,
      details: `${label}: ${description.trim()}`,
    });
  }

  protected completeActivity(activity: GuidedActivity): void {
    if (activity.category.id === 'hydration') {
      this.interactions.register('habit_completed', 'hydration', 'Um copo de água registrado');
      this.feedback.show('Copo de água registrado. Você ganhou 10 XP.');
    } else if (activity.category.id === 'nutrition') {
      this.interactions.register('habit_completed', 'nutrition', activity.details);
      const label = activity.details?.split(':')[0] || 'Refeição';
      this.mealForm.reset({ type: 'breakfast', description: '' });
      this.feedback.show(`${label} registrada. Você ganhou 10 XP.`);
    }
    this.activeActivity.set(null);
  }

  protected dismissActivity(): void { this.activeActivity.set(null); }

  protected useMealIdea(idea: (typeof MEAL_IDEAS)[number]): void {
    this.mealForm.setValue({ type: idea.type, description: idea.description });
    this.feedback.show('Sugestão carregada. Ajuste os alimentos ao que você gosta e pode consumir.');
  }

  protected usePlanIdea(idea: (typeof MEAL_IDEAS)[number]): void {
    this.planForm.controls.mealType.setValue(idea.type);
    this.planForm.controls.mealDescription.setValue(idea.description);
    this.feedback.show('Sugestão adicionada ao rascunho do plano. Você pode editar antes de salvar.');
  }

  protected selectPlanMealType(type: NutritionMealType): void {
    this.planForm.controls.mealType.setValue(type);
  }

  protected addPlanMeal(): void {
    this.planForm.controls.mealDescription.markAsTouched();
    if (this.planForm.controls.mealType.invalid || this.planForm.controls.mealDescription.invalid) return;
    if (this.planMeals().length >= 16) {
      this.planError.set('Este plano já tem o máximo de 16 refeições.');
      return;
    }

    const { mealType, mealDescription } = this.planForm.getRawValue();
    this.planMeals.update((meals) => [...meals, {
      id: crypto.randomUUID(),
      type: mealType,
      description: mealDescription.trim(),
    }]);
    this.planForm.controls.mealDescription.reset();
    this.planForm.controls.mealDescription.markAsUntouched();
    this.planError.set('');
  }

  protected removePlanMeal(id: string): void {
    this.planMeals.update((meals) => meals.filter((meal) => meal.id !== id));
  }

  protected savePlan(): void {
    this.planForm.controls.name.markAsTouched();
    this.planError.set('');
    if (this.planForm.controls.name.invalid) return;
    if (!this.planMeals().length) {
      this.planError.set('Adicione pelo menos uma refeição ao plano.');
      return;
    }

    const { name, source } = this.planForm.getRawValue();
    this.nutrition.createPlan(name, this.planMeals(), source as NutritionPlanSource);
    this.planForm.reset({ name: '', source: 'personal', mealType: 'breakfast', mealDescription: '' });
    this.planMeals.set([]);
    this.feedback.show('Plano alimentar salvo neste dispositivo.');
  }

  protected deletePlan(id: string): void {
    const deleted = this.nutrition.deletePlan(id);
    if (deleted) this.feedback.show(`Plano “${deleted.name}” apagado.`);
  }

  protected mealTypeLabel(type: NutritionMealType): string {
    return this.mealTypes.find((item) => item.value === type)?.label ?? 'Refeição';
  }

  protected planSourceLabel(source: NutritionPlanSource): string {
    return source === 'professional' ? 'Prescrito por nutricionista' : 'Criado por você';
  }

  protected isNutritionEntry(event: InteractionEvent): boolean {
    return event.type === 'habit_completed' &&
      (event.category === 'hydration' || event.category === 'nutrition') && !!event.details;
  }

  protected formatDate(value: string): string {
    return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  protected deleteEntry(id: string): void {
    if (this.interactions.deleteEvent(id)) this.feedback.show('Registro de nutrição apagado do histórico.');
  }
}
