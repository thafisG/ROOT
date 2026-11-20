import { InteractionEvent } from '../../features/dashboard/models/dashboard.models';

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function calculateActivityStreak(
  history: readonly InteractionEvent[],
  now = new Date(),
): number {
  const activityDates = new Set<string>();

  for (const event of history) {
    if (event.type !== 'habit_completed' && event.type !== 'workout_completed') continue;

    const date = new Date(event.createdAt);
    if (!Number.isNaN(date.getTime()) && date.getTime() <= now.getTime()) {
      activityDates.add(localDateKey(date));
    }
  }

  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!activityDates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (activityDates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
