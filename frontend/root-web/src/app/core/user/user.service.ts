import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { UserProfile } from '../../features/onboarding/models/onboarding.models';
import { isSupabaseConfigured, supabase } from '../supabase/supabase.client';
import { z } from 'zod';

const STORAGE_KEY = 'user-profile';
const userProfileSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  goal: z.enum(['strength', 'general_health', 'weight_loss', 'mobility', 'wellbeing']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableDaysPerWeek: z.number().int().min(1).max(7),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
});

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly storage = inject(StorageService);
  private readonly _profile = signal<UserProfile | null>(
    this.storage.read<UserProfile | null>(STORAGE_KEY, null, userProfileSchema.nullable()),
  );
  private readonly _isAuthenticated = signal(false);

  readonly profile = this._profile.asReadonly();
  readonly isOnboarded = computed(() => this._profile() !== null);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly ready: Promise<void>;
  readonly isSupabaseConfigured = isSupabaseConfigured;

  constructor() {
    this.ready = supabase.auth
      .getSession()
      .then(({ data }) => {
        this._isAuthenticated.set(!!data.session);
        if (data.session && !this._profile()) this.restoreProfile(data.session.user);
      })
      .then(() => undefined);
    supabase.auth.onAuthStateChange((_event, session) => {
      this._isAuthenticated.set(!!session);
      if (session && !this._profile()) this.restoreProfile(session.user);
    });
  }

  async signUp(
    email: string,
    password: string,
    profile: UserProfile,
  ): Promise<{ ok: boolean; confirmationRequired?: boolean; error?: string }> {
    if (!this.isSupabaseConfigured) {
      return {
        ok: false,
        error: 'Configure a chave publishable do Supabase em src/environments/environment.ts.',
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: profile.name,
          goal: profile.goal,
          experience_level: profile.experienceLevel,
          available_days_per_week: profile.availableDaysPerWeek,
        },
      },
    });
    if (error) return { ok: false, error: this.authError(error.message) };
    if (data.user && data.user.identities?.length === 0) {
      return { ok: false, error: 'Este e-mail já tem cadastro. Entre com sua senha.' };
    }

    this.saveProfile({ ...profile, email: email.trim() });
    this._isAuthenticated.set(!!data.session);
    return { ok: true, confirmationRequired: !data.session };
  }

  async signInWithEmail(
    email: string,
    password: string,
  ): Promise<{ ok: boolean; emailNotFound: boolean; error?: string }> {
    if (!this.isSupabaseConfigured) {
      return {
        ok: false,
        emailNotFound: false,
        error: 'Configure a chave publishable do Supabase em src/environments/environment.ts.',
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      const invalidCredentials =
        error.code === 'invalid_credentials' ||
        error.message.toLowerCase().includes('invalid login credentials');
      return {
        ok: false,
        emailNotFound: invalidCredentials,
        error: invalidCredentials ? 'E-mail não encontrado ou senha incorreta.' : this.authError(error.message),
      };
    }

    this._isAuthenticated.set(true);
    this.restoreProfile(data.user);
    return { ok: true, emailNotFound: false };
  }

  saveProfile(profile: UserProfile): void {
    this._profile.set(profile);
    this.storage.write(STORAGE_KEY, profile);
  }

  clearProfile(): void {
    this._profile.set(null);
    this.storage.clear(STORAGE_KEY);
    this._isAuthenticated.set(false);
    void supabase.auth.signOut();
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this._isAuthenticated.set(false);
  }

  private restoreProfile(user: { email?: string; user_metadata?: Record<string, unknown> }): void {
    const metadata = user.user_metadata ?? {};
    const profile = userProfileSchema.safeParse({
      name: metadata['name'],
      email: user.email,
      goal: metadata['goal'],
      experienceLevel: metadata['experience_level'],
      availableDaysPerWeek: metadata['available_days_per_week'],
      createdAt: new Date().toISOString(),
    });
    if (profile.success) this.saveProfile(profile.data);
  }

  private authError(message: string): string {
    if (message.toLowerCase().includes('already registered')) return 'Este e-mail já tem cadastro. Entre com sua senha.';
    if (message.toLowerCase().includes('password')) return 'A senha precisa ter pelo menos 6 caracteres.';
    return 'Não foi possível acessar sua conta agora. Tente novamente.';
  }
}
