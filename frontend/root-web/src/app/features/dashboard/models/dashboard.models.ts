import { IconName } from "../../../shared/ui/icon/icon.component";

export type HabitCategoryId =
  | 'strength'
  | 'mobility'
  | 'hydration'
  | 'sleep'
  | 'nutrition'
  | 'cardio';

export interface CategoryInfo {
  id: HabitCategoryId;
  label: string;
  icon: IconName;
  colorVar: string;
}

export interface Recommendation {
  category: CategoryInfo;
  title: string;
  explanation: string;
  durationMinutes: number;
}

export interface WeeklyCategoryStat {
  category: CategoryInfo;
  percentage: number;
}

export type WorkoutLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface NextWorkout {
  name: string;
  scheduledLabel: string;
  durationMinutes: number;
  level: WorkoutLevel;
  exerciseCount: number;
}

export interface HabitLogEntry {
  id: string;
  category: CategoryInfo;
  label: string;
  timeLabel: string;
}

export interface SuggestedActivity {
  id: string;
  category: CategoryInfo;
  title: string;
  durationMinutes: number;
}

export interface NavItem {
  label: string;
  icon: IconName;
  route: string;
  isPrimary?: boolean;
}

export const CATEGORIES: Record<HabitCategoryId, CategoryInfo> = {
  strength: { id: 'strength', label: 'Força', icon: 'dumbbell', colorVar: '--color-cat-strength' },
  mobility: { id: 'mobility', label: 'Mobilidade', icon: 'leaf', colorVar: '--color-cat-mobility' },
  hydration: { id: 'hydration', label: 'Hidratação', icon: 'droplet', colorVar: '--color-cat-hydration' },
  sleep: { id: 'sleep', label: 'Sono', icon: 'moon', colorVar: '--color-cat-sleep' },
  nutrition: { id: 'nutrition', label: 'Nutrição', icon: 'apple', colorVar: '--color-cat-nutrition' },
  cardio: { id: 'cardio', label: 'Cardio', icon: 'flame', colorVar: '--color-cat-cardio' },
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Início', icon: 'home', route: '/dashboard' },
  { label: 'Treinos', icon: 'dumbbell', route: '/treinos' },
  { label: 'Recomendações', icon: 'sparkles', route: '/recomendacoes', isPrimary: true },
  { label: 'Analytics', icon: 'chart', route: '/analytics' },
  { label: 'Perfil', icon: 'user', route: '/perfil' },
];
