import { TestBed } from '@angular/core/testing';
import { UserProfile } from '../../features/onboarding/models/onboarding.models';
import { UserService } from './user.service';

describe('UserService local sign-in', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [UserService] });
  });

  afterEach(() => localStorage.clear());

  it('allows the saved profile to sign in again by e-mail', () => {
    const service = TestBed.inject(UserService);
    const profile: UserProfile = {
      name: 'Alex',
      email: 'alex@example.com',
      goal: 'general_health',
      experienceLevel: 'beginner',
      availableDaysPerWeek: 3,
      createdAt: new Date().toISOString(),
    };

    service.saveProfile(profile);
    service.signOut();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.signInWithEmail('  ALEX@example.com ')).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('rejects an e-mail that does not match the local profile', () => {
    const service = TestBed.inject(UserService);
    service.saveProfile({
      name: 'Alex',
      email: 'alex@example.com',
      goal: 'general_health',
      experienceLevel: 'beginner',
      availableDaysPerWeek: 3,
      createdAt: new Date().toISOString(),
    });
    service.signOut();

    expect(service.signInWithEmail('someone@example.com')).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });
});
