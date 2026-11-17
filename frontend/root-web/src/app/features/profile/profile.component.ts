import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { InteractionService } from '../../core/interaction/interaction.service';
import { UserService } from '../../core/user/user.service';
import { GOAL_OPTIONS } from '../onboarding/models/onboarding.models';
import { WorkoutService } from '../workouts/workout.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';

@Component({
  selector: 'app-root-profile',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly users = inject(UserService);
  private readonly interactions = inject(InteractionService);
  private readonly router = inject(Router);
  private readonly workouts = inject(WorkoutService);
  private readonly feedback = inject(ActionFeedbackService);

  protected readonly profile = this.users.profile;
  protected readonly confirmDelete = signal(false);
  protected readonly goalLabel = computed(
    () => GOAL_OPTIONS.find((option) => option.value === this.profile()?.goal)?.label ?? '',
  );

  protected signOut(): void {
    this.users.signOut();
    this.feedback.show('Você saiu. Seu perfil e seus dados continuam salvos neste dispositivo.');
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  protected deleteData(): void {
    this.interactions.clearHistory();
    this.workouts.clearAll();
    this.users.clearProfile();
    this.feedback.show('Perfil, fichas e histórico apagados deste dispositivo.');
    void this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }
}
