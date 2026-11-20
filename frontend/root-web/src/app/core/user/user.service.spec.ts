import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { supabase } from '../supabase/supabase.client';
import { UserService } from './user.service';

describe('UserService Supabase sign-in', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null,
    } as never);
    vi.spyOn(supabase.auth, 'onAuthStateChange').mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as never);
    TestBed.configureTestingModule({ providers: [UserService] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('signs in with the normalized e-mail and password, then restores the profile', async () => {
    const authUser = {
      id: 'user-1',
      email: 'alex@example.com',
      user_metadata: {
        name: 'Alex',
        goal: 'general_health',
        experience_level: 'beginner',
        available_days_per_week: 3,
      },
    } as never;
    const signIn = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
      data: { user: authUser },
      error: null,
    } as never);
    const service = TestBed.inject(UserService);

    await service.ready;
    const result = await service.signInWithEmail('  ALEX@example.com ', 'secure-password');

    expect(signIn).toHaveBeenCalledWith({ email: 'ALEX@example.com', password: 'secure-password' });
    expect(result).toEqual({ ok: true });
    expect(service.isAuthenticated()).toBe(true);
    expect(service.profile()?.email).toBe('alex@example.com');
  });

  it('returns an authentication error for an unknown e-mail or wrong password', async () => {
    vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
      data: { user: null, session: null },
      error: { code: 'invalid_credentials', message: 'Invalid login credentials' },
    } as never);
    const service = TestBed.inject(UserService);

    await service.ready;
    const result = await service.signInWithEmail('someone@example.com', 'wrong-password');

    expect(result.ok).toBe(false);
    expect(result.error).toContain('E-mail ou senha incorretos');
    expect(service.isAuthenticated()).toBe(false);
  });
});
