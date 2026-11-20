import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionEvent } from '../../features/dashboard/models/dashboard.models';
import { UserProfile } from '../../features/onboarding/models/onboarding.models';
import { InteractionService } from '../interaction/interaction.service';
import { UserService } from '../user/user.service';
import { RecommendationService } from './recommendation.service';

describe('RecommendationService', () => {
  let history: WritableSignal<InteractionEvent[]>;
  let profile: WritableSignal<UserProfile | null>;

  beforeEach(() => {
    history = signal<InteractionEvent[]>([]);
    profile = signal<UserProfile | null>(null);
    TestBed.configureTestingModule({
      providers: [
        RecommendationService,
        { provide: InteractionService, useValue: { history: history.asReadonly() } },
        { provide: UserService, useValue: { profile: profile.asReadonly() } },
      ],
    });
  });

  it('stays in learning mode until there are three completed activities', () => {
    const service = TestBed.inject(RecommendationService);
    history.set(
      Array.from({ length: 3 }, (_, index) => ({
        id: `click-${index}`,
        type: 'recommendation_clicked' as const,
        category: 'strength' as const,
        createdAt: new Date().toISOString(),
      })),
    );

    expect(service.result().isLearning).toBe(true);

    history.set(
      Array.from({ length: 3 }, (_, index) => ({
        id: `completed-${index}`,
        type: 'habit_completed' as const,
        category: 'strength' as const,
        createdAt: new Date().toISOString(),
      })),
    );

    expect(service.result().isLearning).toBe(false);
    expect(service.result().primary?.explanation).toBeTruthy();
  });

  it('uses the profile to adjust recommendation duration', () => {
    history.set(
      Array.from({ length: 3 }, (_, index) => ({
        id: `completed-${index}`,
        type: 'habit_completed' as const,
        category: 'strength' as const,
        createdAt: new Date().toISOString(),
      })),
    );

    const service = TestBed.inject(RecommendationService);
    const defaultDuration = service.result().primary?.durationMinutes ?? 0;
    profile.set({
      name: 'Alex',
      email: 'alex@example.com',
      goal: 'general_health',
      experienceLevel: 'beginner',
      availableDaysPerWeek: 2,
      createdAt: new Date().toISOString(),
    });
    const recommendation = service.result().primary;

    expect(recommendation?.durationMinutes).toBeGreaterThan(0);
    expect(recommendation?.durationMinutes).toBeLessThan(defaultDuration);
  });
});
