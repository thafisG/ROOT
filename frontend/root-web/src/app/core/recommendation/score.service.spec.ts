import { InteractionEvent } from '../../features/dashboard/models/dashboard.models';
import { ScoreService } from './score.service';

function event(
  id: string,
  type: InteractionEvent['type'],
  category: InteractionEvent['category'],
  ageHours = 1,
): InteractionEvent {
  return {
    id,
    type,
    category,
    createdAt: new Date(Date.now() - ageHours * 60 * 60 * 1000).toISOString(),
  };
}

describe('ScoreService', () => {
  const service = new ScoreService();

  it('gives a small priority to the category that matches the user goal', () => {
    const withoutGoal = service.calculate([]);
    const withGoal = service.calculate([], 'strength');
    const baseStrength = withoutGoal.find((score) => score.categoryId === 'strength')!.needScore;
    const targetStrength = withGoal.find((score) => score.categoryId === 'strength')!.needScore;

    expect(targetStrength).toBeCloseTo(baseStrength * 1.15);
  });

  it('reduces a recently dismissed category during its cooldown', () => {
    const baseline = service.calculate([]).find((score) => score.categoryId === 'mobility')!.needScore;
    const withDismissal = service
      .calculate([event('dismissed', 'recommendation_dismissed', 'mobility')])
      .find((score) => score.categoryId === 'mobility')!.needScore;

    expect(withDismissal).toBeCloseTo(baseline * 0.3);
  });

  it('ignores recommendation clicks when calculating completed activity frequency', () => {
    const scores = service.calculate([
      event('click', 'recommendation_clicked', 'strength'),
      event('done', 'habit_completed', 'strength'),
    ]);

    expect(scores.find((score) => score.categoryId === 'strength')?.frequency).toBe(1);
  });
});
