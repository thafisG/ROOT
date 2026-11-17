import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from '../../core/interaction/interaction.service';
import { UserService } from '../../core/user/user.service';
import { GOAL_OPTIONS } from '../onboarding/models/onboarding.models';

@Component({
  selector: 'app-root-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly users = inject(UserService);
  private readonly interactions = inject(InteractionService);
  private readonly router = inject(Router);

  protected readonly profile = this.users.profile;
  protected readonly confirmDelete = signal(false);
  protected readonly goalLabel = computed(
    () => GOAL_OPTIONS.find((option) => option.value === this.profile()?.goal)?.label ?? '',
  );

  protected signOut(): void {
    this.users.signOut();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  protected deleteData(): void {
    this.interactions.clearHistory();
    this.users.clearProfile();
    void this.router.navigateByUrl('/onboarding', { replaceUrl: true });
  }
}
