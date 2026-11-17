import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/user/user.service';
import { ActionFeedbackService } from '../../core/feedback/action-feedback.service';

@Component({
  selector: 'app-root-login',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  private readonly feedback = inject(ActionFeedbackService);

  protected readonly error = signal('');
  protected readonly isSupabaseConfigured = this.users.isSupabaseConfigured;
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected async submit(): Promise<void> {
    this.error.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    let result: Awaited<ReturnType<UserService['signInWithEmail']>>;
    try {
      result = await this.users.signInWithEmail(
        this.form.controls.email.value,
        this.form.controls.password.value,
      );
    } catch {
      this.error.set('Não foi possível conectar ao Supabase. Confira sua conexão e tente novamente.');
      return;
    }
    if (!result.ok) {
      this.error.set(result.error ?? 'Não foi possível entrar.');
      return;
    }

    this.feedback.show('Entrada realizada. Bem-vindo de volta!');
    void this.router.navigateByUrl('/dashboard', { replaceUrl: true });
  }
}
