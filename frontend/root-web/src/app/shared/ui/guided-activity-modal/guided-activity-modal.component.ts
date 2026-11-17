import { ChangeDetectionStrategy, Component, OnDestroy, input, output, signal } from '@angular/core';
import { IconName } from '../icon/icon.component';

export interface GuidedActivity {
  category: { id: string; label: string; icon: IconName; colorVar: string };
  title: string;
  durationMinutes: number;
  details?: string;
}

type ActivityPhase = 'choose' | 'timer' | 'support' | 'water-game' | 'water-animation';

@Component({
  selector: 'app-guided-activity-modal',
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
  protected readonly balance = signal(5);
  protected readonly waterGameReady = signal(false);
  private timer: ReturnType<typeof setInterval> | null = null;

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
  protected startWaterGame(): void { this.phase.set('water-game'); this.balance.set(5); this.waterGameReady.set(false); }
  protected startWaterAnimation(): void { this.phase.set('water-animation'); }

  protected updateBalance(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.balance.set(value);
    this.waterGameReady.set(value >= 46 && value <= 56);
  }

  protected get timeLabel(): string {
    const minutes = Math.floor(this.remainingSeconds() / 60).toString().padStart(2, '0');
    const seconds = (this.remainingSeconds() % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  protected finish(): void {
    this.clearTimer();
    this.complete.emit(this.activity());
  }

  protected close(): void {
    this.clearTimer();
    this.dismiss.emit();
  }

  ngOnDestroy(): void { this.clearTimer(); }

  private clearTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
