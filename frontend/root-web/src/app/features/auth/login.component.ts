import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'app-root-login',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly hasLocalProfile = this.users.isOnboarded;
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    if (!this.hasLocalProfile()) {
      void this.router.navigateByUrl('/onboarding', { replaceUrl: true });
    }
  }

  protected submit(): void {
    this.error.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    if (!this.users.signInWithEmail(this.form.controls.email.value)) {
      void this.router.navigateByUrl(
        this.hasLocalProfile() ? '/onboarding?register=1' : '/onboarding',
        { replaceUrl: true },
      );
      return;
    }

    void this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }
}
