import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { InteractionService } from '../../core/interaction/interaction.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';
import { WorkoutRoutine, WorkoutService } from './workout.service';
import { WorkoutDraft, WorkoutPlanAnswers, WORKOUT_PRESETS, generateWorkoutPlan } from './workout-plans';
import {
  EXPERIENCE_OPTIONS,
  FitnessGoal,
  GOAL_OPTIONS,
  ExperienceLevel,
} from '../onboarding/models/onboarding.models';
import { UserService } from '../../core/user/user.service';
import { WorkoutManualBuilderComponent } from './components/workout-manual-builder/workout-manual-builder.component';

type CardAttributeId = 'legs' | 'chest' | 'back' | 'arms' | 'core' | 'cardio' | 'mobility';
interface CardAttribute { id: CardAttributeId; label: string; icon: string; }
interface RobotPlayCard { id: number; name: string; emblem: string; stats: Record<CardAttributeId, number>; }
interface CardRoundResult { playerName: string; robotName: string; attribute: CardAttributeId; playerValue: number; robotValue: number; winner: 'player' | 'robot' | 'draw'; }

@Component({
  selector: 'app-root-workouts',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, WorkoutManualBuilderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly workouts = inject(WorkoutService);
  private readonly interactions = inject(InteractionService);
  private readonly feedback = inject(ActionFeedbackService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  protected readonly isGallery = this.route.snapshot.data['gallery'] === true;
  protected readonly routines = this.workouts.routines;
  protected readonly completedRoutines = computed(() => this.routines().filter((routine) => (routine.completions ?? 0) > 0));
  protected readonly routinesForPage = computed(() => this.routines().filter((routine) =>
    this.isGallery ? (routine.completions ?? 0) > 0 : (routine.completions ?? 0) === 0,
  ));
  protected readonly latestCompletedId = this.workouts.lastCompletedId;
  protected readonly presets = WORKOUT_PRESETS;
  protected readonly goalOptions = GOAL_OPTIONS;
  protected readonly experienceOptions = EXPERIENCE_OPTIONS;
  protected readonly dayOptions = [1, 2, 3, 4, 5, 6, 7];
  protected readonly sessionOptions: readonly (30 | 45 | 60)[] = [30, 45, 60];
  protected readonly activeWorkoutId = signal<string | null>(null);
  protected readonly completedExercises = signal<string[]>([]);
  protected readonly collectionGameOpen = signal(false);
  protected readonly playerHand = signal<WorkoutRoutine[]>([]);
  protected readonly robotDeck = signal<RobotPlayCard[]>([]);
  protected readonly currentRobotCard = signal<RobotPlayCard | null>(null);
  protected readonly selectedPlayerCardId = signal<string | null>(null);
  protected readonly cardRounds = signal<CardRoundResult[]>([]);
  protected readonly collectionGameResult = signal<'won' | 'lost' | 'draw' | null>(null);
  protected readonly collectionGameMessage = signal('');
  protected readonly playerRoundWins = computed(() => this.cardRounds().filter((round) => round.winner === 'player').length);
  protected readonly robotRoundWins = computed(() => this.cardRounds().filter((round) => round.winner === 'robot').length);
  protected readonly cardAttributes: readonly CardAttribute[] = [
    { id: 'legs', label: 'Pernas', icon: '🦵' },
    { id: 'chest', label: 'Peito', icon: '🛡️' },
    { id: 'back', label: 'Costas', icon: '🪽' },
    { id: 'arms', label: 'Braços', icon: '💪' },
    { id: 'core', label: 'Core', icon: '⚡' },
    { id: 'cardio', label: 'Fôlego', icon: '🔥' },
    { id: 'mobility', label: 'Mobilidade', icon: '🧘' },
  ];
  protected readonly editingCardId = signal<string | null>(null);
  protected readonly flippedCardId = signal<string | null>(null);
  protected readonly rpgMode = signal(false);
  protected readonly cardThemes = [
    { id: 'moss', label: 'Bosque', emblem: '🌿' },
    { id: 'sunset', label: 'Aurora', emblem: '🔥' },
    { id: 'ocean', label: 'Oceano', emblem: '🌊' },
    { id: 'royal', label: 'Arcano', emblem: '✦' },
  ] as const;
  protected readonly cardEmblems = ['🌿', '🔥', '🌊', '✦', '🐺', '🦊', '🦅', '🐉', '🛡️', '⚡'];
  protected readonly cardColors = [
    { name: 'Menta', value: '#cdebd9' },
    { name: 'Pêssego', value: '#f5d4bf' },
    { name: 'Céu', value: '#c9e5f4' },
    { name: 'Lavanda', value: '#e1d3f2' },
    { name: 'Rosa', value: '#f3d2dc' },
    { name: 'Dourado', value: '#f1e0ad' },
    { name: 'Noite', value: '#d4d3ed' },
    { name: 'Areia', value: '#e8ddc9' },
  ];
  protected readonly cardFrames = [
    { id: 'classic', label: 'Clássica' },
    { id: 'gilded', label: 'Dourada' },
    { id: 'arcane', label: 'Arcana' },
    { id: 'etched', label: 'Entalhada' },
  ] as const;
  protected readonly cycleOptions = [7, 14, 21, 28, 42, 56, 90];
  protected readonly planForm = this.fb.nonNullable.group({
    goal: [this.userService.profile()?.goal ?? 'general_health', Validators.required],
    daysPerWeek: [this.userService.profile()?.availableDaysPerWeek ?? 3, [Validators.required, Validators.min(1), Validators.max(7)]],
    experienceLevel: [this.userService.profile()?.experienceLevel ?? 'beginner', Validators.required],
    sessionMinutes: [45, Validators.required],
  });
  protected readonly activeWorkout = computed(
    () => this.routines().find((routine) => routine.id === this.activeWorkoutId()) ?? null,
  );

  protected selectGoal(goal: FitnessGoal): void {
    this.planForm.controls.goal.setValue(goal);
  }

  protected selectDays(days: number): void {
    this.planForm.controls.daysPerWeek.setValue(days);
  }

  protected selectExperience(level: ExperienceLevel): void {
    this.planForm.controls.experienceLevel.setValue(level);
  }

  protected selectDuration(minutes: 30 | 45 | 60): void {
    this.planForm.controls.sessionMinutes.setValue(minutes);
  }

  protected addPreset(preset: WorkoutDraft): void {
    this.workouts.create(preset.name, preset.exercises);
    this.feedback.show(`Ficha “${preset.name}” adicionada aos seus treinos.`);
  }

  protected buildPlan(): void {
    this.planForm.markAllAsTouched();
    if (this.planForm.invalid) return;

    const values = this.planForm.getRawValue();
    const answers: WorkoutPlanAnswers = {
      goal: values.goal as FitnessGoal,
      daysPerWeek: values.daysPerWeek,
      experienceLevel: values.experienceLevel as ExperienceLevel,
      sessionMinutes: values.sessionMinutes as 30 | 45 | 60,
    };
    const plan = generateWorkoutPlan(answers);
    plan.forEach((routine) => this.workouts.create(routine.name, routine.exercises));
    const recoveryNote = values.daysPerWeek > 5 ? ' Separei até dois dias para recuperação.' : '';
    this.feedback.show(`Plano montado com ${plan.length} fichas.${recoveryNote} Você pode revisar e ajustar cada exercício.`);
  }

  protected startWorkout(routine: WorkoutRoutine, asRpg = false): void {
    this.workouts.startCycle(routine.id);
    this.activeWorkoutId.set(routine.id);
    this.completedExercises.set([]);
    this.rpgMode.set(asRpg);
    this.feedback.show(asRpg ? `Aventura “${routine.name}” iniciada. Complete as etapas para vencer o desafio!` : `Treino ${routine.name} iniciado.`);
  }

  protected toggleCardEditor(id: string): void {
    this.editingCardId.update((current) => current === id ? null : id);
  }

  protected toggleCardFace(id: string): void {
    this.flippedCardId.update((current) => current === id ? null : id);
  }

  protected onCardKeydown(event: KeyboardEvent, id: string): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.toggleCardFace(id);
  }

  protected customizeCard(routine: WorkoutRoutine, theme: typeof this.cardThemes[number]): void {
    this.workouts.updateCardDetails(routine.id, { cardTheme: theme.id });
    this.feedback.show(`Carta decorada no estilo ${theme.label}.`);
  }

  protected updateCardText(routine: WorkoutRoutine, field: 'cardTitle' | 'cardLore', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.workouts.updateCardDetails(routine.id, { [field]: value.slice(0, field === 'cardTitle' ? 40 : 120) });
  }

  protected selectEmblem(routine: WorkoutRoutine, emblem: string): void {
    this.workouts.updateCardDetails(routine.id, { cardEmblem: emblem });
  }

  protected selectFrame(routine: WorkoutRoutine, frame: typeof this.cardFrames[number]): void {
    this.workouts.updateCardDetails(routine.id, { cardFrame: frame.id });
  }

  protected selectAccent(routine: WorkoutRoutine, event: Event): void {
    this.workouts.updateCardDetails(routine.id, { cardAccent: (event.target as HTMLInputElement).value });
  }

  protected selectCardColor(routine: WorkoutRoutine, color: string): void {
    this.workouts.updateCardDetails(routine.id, { cardColor: color });
  }

  protected selectCustomCardColor(routine: WorkoutRoutine, event: Event): void {
    this.selectCardColor(routine, (event.target as HTMLInputElement).value);
  }

  protected selectCycleDays(routine: WorkoutRoutine, event: Event): void {
    this.workouts.updateCardDetails(routine.id, { cycleDays: Number((event.target as HTMLSelectElement).value) });
  }

  protected cycleDaysRemaining(routine: WorkoutRoutine): number | null {
    if (!routine.cycleStartedAt) return null;
    const end = new Date(routine.cycleStartedAt);
    end.setDate(end.getDate() + (routine.cycleDays ?? 28));
    return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
  }

  protected cycleEndLabel(routine: WorkoutRoutine): string {
    if (!routine.cycleStartedAt) return `Ciclo de ${routine.cycleDays ?? 28} dias · começa no primeiro treino`;
    const end = new Date(routine.cycleStartedAt);
    end.setDate(end.getDate() + (routine.cycleDays ?? 28));
    return end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  protected renewCycle(routine: WorkoutRoutine): void {
    this.workouts.renewCycle(routine.id);
    this.feedback.show(`Novo ciclo de ${routine.cycleDays ?? 28} dias iniciado para “${routine.name}”.`);
  }

  protected cardStats(routine: WorkoutRoutine): Record<CardAttributeId, number> {
    const trainingVolume: Record<CardAttributeId, number> = { legs: 0, chest: 0, back: 0, arms: 0, core: 0, cardio: 0, mobility: 0 };
    for (const exercise of routine.exercises) {
      const normalized = exercise.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const sets = Number(normalized.match(/\b(\d+)\s*[x×]/)?.[1] ?? 1);
      const category: CardAttributeId | null =
        /(perna|agach|quadriceps|posterior|glute|panturr|leg press|passada|afundo|stiff|terra|elevacao pelvica|step-up|extensora|hack)/.test(normalized) ? 'legs' :
        /(peito|supino|crucifixo|peck deck|flexao)/.test(normalized) ? 'chest' :
        /(costas|remada|puxada|dorsal|barra fixa)/.test(normalized) ? 'back' :
        /(braco|biceps|triceps|rosca|desenvolvimento|ombro)/.test(normalized) ? 'arms' :
        /(abdomen|abdominal|prancha|core|lombar)/.test(normalized) ? 'core' :
        /(corrida|caminhada|bicicleta|bike|esteira|cardio|burpee|polichinelo)/.test(normalized) ? 'cardio' :
        /(mobilidade|alongamento|respiracao|stretch)/.test(normalized) ? 'mobility' : null;
      if (category) trainingVolume[category] += Math.max(1, Math.min(10, sets));
    }
    return Object.fromEntries(Object.entries(trainingVolume).map(([attribute, volume]) => [
      attribute,
      Math.min(99, 12 + volume * 9 + Math.min(12, (routine.completions ?? 0) * 2)),
    ])) as Record<CardAttributeId, number>;
  }

  protected startCollectionGame(): void {
    const collection = this.completedRoutines();
    if (collection.length === 0) {
      this.feedback.show('Conclua um treino para conquistar sua primeira carta.');
      return;
    }
    const player = this.shuffle([...collection]);
    const averages = this.cardAttributes.map(({ id }) => Math.round(collection.reduce((sum, card) => sum + this.cardStats(card)[id], 0) / collection.length));
    const robot = player.map((_, index) => {
      const specialty = this.cardAttributes[index % this.cardAttributes.length].id;
      const stats = Object.fromEntries(this.cardAttributes.map(({ id }, statIndex) => [
        id,
        Math.max(12, Math.min(99, Math.round(averages[statIndex] * 0.65 + Math.random() * 25 + (id === specialty ? 15 : 0)))),
      ])) as Record<CardAttributeId, number>;
      const names = ['Autômato de Ferro', 'Sentinela ROOT', 'Núcleo Prisma', 'Guardião Mecânico', 'Androide de Treino', 'Robô Titã'];
      return { id: index, name: names[index % names.length], emblem: '🤖', stats };
    }).sort((a, b) => Math.max(...Object.values(b.stats)) - Math.max(...Object.values(a.stats)));

    this.playerHand.set(player);
    this.robotDeck.set(robot.slice(1));
    this.currentRobotCard.set(robot[0]);
    this.selectedPlayerCardId.set(null);
    this.cardRounds.set([]);
    this.collectionGameResult.set(null);
    this.collectionGameMessage.set(`O Robô ROOT jogou ${robot[0].name}. Escolha uma carta da sua mão.`);
    this.collectionGameOpen.set(true);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.collection-game')?.focus());
  }

  protected cardGamePower(routine: WorkoutRoutine): number {
    const stats = this.cardStats(routine);
    return Math.round(Object.values(stats).reduce((sum, value) => sum + value, 0) / this.cardAttributes.length);
  }

  protected cardAttributeLabel(id: CardAttributeId): string {
    return this.cardAttributes.find((attribute) => attribute.id === id)?.label ?? id;
  }

  protected selectedPlayerCard(): WorkoutRoutine | null {
    return this.playerHand().find((card) => card.id === this.selectedPlayerCardId()) ?? null;
  }

  protected selectPlayerCard(id: string): void {
    if (this.collectionGameResult()) return;
    this.selectedPlayerCardId.set(id);
    this.collectionGameMessage.set('Carta escolhida. Agora selecione o atributo para comparar com o robô.');
  }

  protected playCardAttribute(attribute: CardAttributeId): void {
    const playerCard = this.selectedPlayerCard();
    const robotCard = this.currentRobotCard();
    if (!playerCard || !robotCard || this.collectionGameResult()) return;
    const playerValue = this.cardStats(playerCard)[attribute];
    const robotValue = robotCard.stats[attribute];
    const winner = playerValue > robotValue ? 'player' : playerValue < robotValue ? 'robot' : 'draw';
    const round: CardRoundResult = {
      playerName: playerCard.cardTitle || playerCard.name,
      robotName: robotCard.name,
      attribute,
      playerValue,
      robotValue,
      winner,
    };
    this.cardRounds.update((rounds) => [...rounds, round]);
    this.workouts.recordCardBattle(playerCard.id, winner === 'player' ? 'won' : winner === 'robot' ? 'lost' : 'draw');
    this.playerHand.update((hand) => hand.filter((card) => card.id !== playerCard.id));
    this.selectedPlayerCardId.set(null);

    if (this.playerHand().length === 0) {
      const result = this.playerRoundWins() > this.robotRoundWins() ? 'won' : this.playerRoundWins() < this.robotRoundWins() ? 'lost' : 'draw';
      this.collectionGameResult.set(result);
      this.collectionGameMessage.set(result === 'won' ? 'Sua coleção venceu o duelo!' : result === 'lost' ? 'O Robô ROOT venceu o duelo desta vez.' : 'A partida terminou empatada.');
      return;
    }

    const nextRobot = this.robotDeck()[0];
    this.robotDeck.update((deck) => deck.slice(1));
    this.currentRobotCard.set(nextRobot ?? null);
    const roundMessage = winner === 'player' ? 'Você venceu a rodada!' : winner === 'robot' ? 'O robô venceu esta rodada.' : 'Rodada empatada.';
    this.collectionGameMessage.set(`${roundMessage} O Robô ROOT jogou ${nextRobot?.name ?? 'sua próxima carta'}. Escolha uma carta da sua mão.`);
  }

  protected onCollectionGameKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!this.selectedPlayerCardId() && /^[1-9]$/.test(event.key)) {
      const card = this.playerHand()[Number(event.key) - 1];
      if (card) { event.preventDefault(); this.selectPlayerCard(card.id); }
      return;
    }
    if (this.selectedPlayerCardId() && /^[1-6]$/.test(event.key)) {
      const attribute = this.cardAttributes[Number(event.key) - 1];
      if (attribute) { event.preventDefault(); this.playCardAttribute(attribute.id); }
    }
  }

  protected closeCollectionGame(): void {
    this.collectionGameOpen.set(false);
  }

  private shuffle<T>(items: T[]): T[] {
    for (let index = items.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  }

  protected async onArtworkSelected(event: Event, routine: WorkoutRoutine): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.feedback.show('Escolha um arquivo de imagem para a arte da carta.');
      input.value = '';
      return;
    }

    try {
      const image = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas indisponível');
      const scale = Math.max(size / image.width, size / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      image.close();
      const artwork = canvas.toDataURL('image/webp', 0.76);
      if (artwork.length > 650_000) throw new Error('Imagem muito grande');
      this.workouts.customizeArtwork(routine.id, artwork);
      this.feedback.show(`Arte aplicada à carta “${routine.name}”.`);
    } catch {
      this.feedback.show('Não foi possível usar essa imagem. Tente outra menor.');
    } finally {
      input.value = '';
    }
  }

  protected removeArtwork(routine: WorkoutRoutine): void {
    this.workouts.customizeArtwork(routine.id, null);
    this.feedback.show('Arte removida. A carta voltou ao emblema original.');
  }

  protected cardLevel(routine: WorkoutRoutine): { label: string; rank: number } {
    const completions = routine.completions ?? 0;
    if (completions >= 10) return { label: 'Lendária', rank: 4 };
    if (completions >= 5) return { label: 'Épica', rank: 3 };
    if (completions >= 2) return { label: 'Rara', rank: 2 };
    return { label: 'Inicial', rank: 1 };
  }

  protected deleteWorkout(routine: WorkoutRoutine): void {
    const deleted = this.workouts.delete(routine.id);
    if (deleted) this.feedback.show(`Ficha “${deleted.name}” apagada.`);
  }

  protected toggleExercise(exercise: string): void {
    this.completedExercises.update((completed) =>
      completed.includes(exercise)
        ? completed.filter((item) => item !== exercise)
        : [...completed, exercise],
    );
  }

  protected finishWorkout(): void {
    const routine = this.activeWorkout();
    if (!routine || this.completedExercises().length !== routine.exercises.length) return;

    const wasRpg = this.rpgMode();
    this.interactions.register('workout_completed', 'strength', routine.name);
    const completions = this.workouts.recordCompletion(routine.id);
    this.activeWorkoutId.set(null);
    this.completedExercises.set([]);
    this.rpgMode.set(false);
    const evolved = [2, 5, 10].includes(completions) ? ` Sua carta evoluiu para ${this.cardLevel({ ...routine, completions }).label}!` : '';
    this.feedback.show(`${wasRpg ? 'Aventura' : 'Treino'} ${routine.name} concluído. Você ganhou 10 XP. A carta está na galeria.${evolved}`);
  }
}
