import { generateWorkoutPlan, WORKOUT_PRESETS } from './workout-plans';

describe('workout plans', () => {
  it('provides independent preset workouts to choose from', () => {
    expect(WORKOUT_PRESETS.length).toBeGreaterThanOrEqual(3);
    expect(WORKOUT_PRESETS.every((preset) => preset.exercises.length > 0)).toBe(true);
  });

  it('builds a full-body routine for one training day', () => {
    const plan = generateWorkoutPlan({
      goal: 'general_health',
      daysPerWeek: 1,
      experienceLevel: 'beginner',
      sessionMinutes: 45,
    });

    expect(plan).toHaveLength(1);
    expect(plan[0].name).toContain('Corpo todo');
    expect(plan[0].exercises.every((exercise) => exercise.includes('2×'))).toBe(true);
  });

  it('uses the selected weekly frequency and session duration', () => {
    const plan = generateWorkoutPlan({
      goal: 'strength',
      daysPerWeek: 4,
      experienceLevel: 'intermediate',
      sessionMinutes: 30,
    });

    expect(plan).toHaveLength(4);
    expect(plan.every((routine) => routine.exercises.length === 4)).toBe(true);
    expect(plan[0].exercises[0]).toContain('3×6–8');
  });

  it('caps the suggested split at five routines when frequency is higher', () => {
    const plan = generateWorkoutPlan({
      goal: 'mobility',
      daysPerWeek: 7,
      experienceLevel: 'advanced',
      sessionMinutes: 60,
    });

    expect(plan).toHaveLength(5);
    expect(plan[1].exercises).toContain('Mobilidade de quadril — 8 min');
  });
});
