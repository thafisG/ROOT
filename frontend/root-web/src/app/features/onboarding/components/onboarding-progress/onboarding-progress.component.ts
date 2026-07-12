import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'root-onboarding-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './onboarding-progress.component.html',
  styleUrl: './onboarding-progress.component.scss',
})
export class OnboardingProgressComponent {
  readonly labels = input.required<string[]>();
  readonly currentIndex = input.required<number>();
}
