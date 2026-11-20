import { InteractionEvent } from '../../features/dashboard/models/dashboard.models';
import { calculateActivityStreak } from './activity-metrics';

function event(id: string, type: InteractionEvent['type'], date: Date): InteractionEvent {
  return { id, type, category: 'strength', createdAt: date.toISOString() };
}

describe('calculateActivityStreak', () => {
  const now = new Date(2026, 10, 17, 12);
  const day = (offset: number): Date => {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    return date;
  };

  it('continues from yesterday when there is no activity yet today', () => {
    expect(calculateActivityStreak([event('yesterday', 'habit_completed', day(-1))], now)).toBe(1);
  });

  it('counts consecutive completed days including today', () => {
    expect(
      calculateActivityStreak(
        [
          event('today', 'workout_completed', day(0)),
          event('yesterday', 'habit_completed', day(-1)),
          event('two-days-ago', 'habit_completed', day(-2)),
        ],
        now,
      ),
    ).toBe(3);
  });

  it('ignores recommendation clicks and future activities', () => {
    expect(
      calculateActivityStreak(
        [
          event('click', 'recommendation_clicked', day(0)),
          event('future', 'habit_completed', day(1)),
        ],
        now,
      ),
    ).toBe(0);
  });

  it('returns zero after a gap longer than one day', () => {
    expect(calculateActivityStreak([event('old', 'workout_completed', day(-2))], now)).toBe(0);
  });
});
