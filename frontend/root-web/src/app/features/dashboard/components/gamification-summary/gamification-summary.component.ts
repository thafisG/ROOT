import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const XP_PER_LEVEL = 100;

@Component({
  selector: 'app-root-gamification-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gamification-summary.component.html',
  styleUrl: './gamification-summary.component.scss',
})
export class GamificationSummaryComponent {
  readonly experiencePoints = input(0);

  protected readonly totalXp = this.experiencePoints;
  protected readonly level = computed(() => Math.floor(this.totalXp() / XP_PER_LEVEL) + 1);
  protected readonly xpInLevel = computed(() => this.totalXp() % XP_PER_LEVEL);
}
