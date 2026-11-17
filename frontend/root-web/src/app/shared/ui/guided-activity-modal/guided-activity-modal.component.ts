import { ChangeDetectionStrategy, Component, OnDestroy, input, output, signal } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

export interface GuidedActivity {
  category: { id: string; label: string; icon: IconName; colorVar: string };
  title: string;
  durationMinutes: number;
  details?: string;
}

type ActivityPhase = 'choose' | 'timer' | 'support' | 'water-game' | 'water-animation';

@Component({
  selector: 'app-guided-activity-modal',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guided-activity-modal.component.html',
  styleUrl: './guided-activity-modal.component.scss',
})
export class GuidedActivityModalComponent implements OnDestroy {
  readonly activity = input.required<GuidedActivity>();
  readonly complete = output<GuidedActivity>();
  readonly dismiss = output<void>();

  protected readonly phase = signal<ActivityPhase>('choose');
  protected readonly remainingSeconds = signal(0);
  protected readonly glassPosition = signal(50);
  protected readonly dropPosition = signal(50);
  protected readonly dropHeight = signal(0);
  protected readonly caughtDrops = signal(0);
  protected readonly gameSeconds = signal(18);
  protected readonly gameEnded = signal(false);
  protected readonly gameMessage = signal('Use as setas ou os controles para mover o copo.');
  private timer: ReturnType<typeof setInterval> | null = null;
  private gameTimer: ReturnType<typeof setInterval> | null = null;
  private gameTicks = 0;

  protected isWater(): boolean { return this.activity().category.id === 'hydration'; }
  protected isMeal(): boolean { return this.activity().category.id === 'nutrition'; }
  protected isSleep(): boolean { return this.activity().category.id === 'sleep'; }

  protected startTimer(): void {
    this.clearTimer();
    this.phase.set('timer');
    this.remainingSeconds.set(Math.max(1, this.activity().durationMinutes * 60));
    this.timer = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(Math.max(0, next));
      if (next <= 0) this.finish();
    }, 1000);
  }

  protected startSupport(): void { this.phase.set('support'); }
  protected startWaterGame(): void {
    this.clearGame();
    this.phase.set('water-game');
    this.glassPosition.set(50);
    this.dropHeight.set(0);
    this.caughtDrops.set(0);
    this.gameSeconds.set(18);
    this.gameEnded.set(false);
    this.gameMessage.set('Pegue 5 gotinhas para encher o copo.');
    this.nextDrop();
    this.gameTicks = 0;
    this.gameTimer = setInterval(() => this.tickWaterGame(), 100);
  }
  protected startWaterAnimation(): void { this.phase.set('water-animation'); }

  protected moveGlass(direction: -1 | 1): void {
    this.glassPosition.update((position) => Math.max(8, Math.min(92, position + direction * 12)));
  }

  protected onGameKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') { event.preventDefault(); this.moveGlass(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); this.moveGlass(1); }
  }

  private tickWaterGame(): void {
    this.gameTicks += 1;
    if (this.gameTicks % 10 === 0) {
      const seconds = this.gameSeconds() - 1;
      this.gameSeconds.set(Math.max(0, seconds));
      if (seconds <= 0) {
        this.endWaterGame(false);
        return;
      }
    }

    const nextHeight = this.dropHeight() + 3;
    this.dropHeight.set(nextHeight);
    if (nextHeight >= 88) {
      if (Math.abs(this.glassPosition() - this.dropPosition()) <= 18) {
        const score = this.caughtDrops() + 1;
        this.caughtDrops.set(score);
        this.gameMessage.set(score >= 5 ? 'Copo cheio! Mandou bem.' : `Gotinha pega! Faltam ${5 - score}.`);
        if (score >= 5) {
          this.endWaterGame(true);
          return;
        }
      } else {
        this.gameMessage.set('A gotinha passou. Ajuste a posição do copo e tente novamente.');
      }
      this.nextDrop();
    }
  }

  private nextDrop(): void {
    this.dropHeight.set(0);
    this.dropPosition.set(12 + Math.round(Math.random() * 76));
  }

  private endWaterGame(won: boolean): void {
    this.clearGame();
    this.gameEnded.set(true);
    if (!won) this.gameMessage.set('O tempo acabou. Você pode tentar de novo ou registrar sem jogar.');
  }

  protected retryWaterGame(): void {
    this.startWaterGame();
  }

  protected get timeLabel(): string {
    const minutes = Math.floor(this.remainingSeconds() / 60).toString().padStart(2, '0');
    const seconds = (this.remainingSeconds() % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  protected finish(): void {
    this.clearTimer();
    this.clearGame();
    this.complete.emit(this.activity());
  }

  protected close(): void {
    this.clearTimer();
    this.clearGame();
    this.dismiss.emit();
  }

  ngOnDestroy(): void { this.clearTimer(); this.clearGame(); }

  private clearTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private clearGame(): void {
    if (this.gameTimer) clearInterval(this.gameTimer);
    this.gameTimer = null;
  }
}
