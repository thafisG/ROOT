import type { IconName } from '../../../shared/ui/icon/icon.component';

export type FitnessGoal = 'strength' | 'general_health' | 'weight_loss' | 'mobility' | 'wellbeing';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  availableDaysPerWeek: number;
  createdAt: string;
}

export interface GoalOption {
  value: FitnessGoal;
  label: string;
  description: string;
  icon: IconName;
}

export interface ExperienceOption {
  value: ExperienceLevel;
  label: string;
  description: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  {
    value: 'strength',
    label: 'Força',
    description: 'Ganhar força e massa muscular',
    icon: 'dumbbell',
  },
  {
    value: 'general_health',
    label: 'Saúde geral',
    description: 'Manter uma rotina equilibrada',
    icon: 'sparkles',
  },
  {
    value: 'weight_loss',
    label: 'Perda de peso',
    description: 'Reduzir peso de forma sustentável',
    icon: 'flame',
  },
  {
    value: 'mobility',
    label: 'Mobilidade',
    description: 'Ganhar flexibilidade e evitar lesões',
    icon: 'leaf',
  },
  {
    value: 'wellbeing',
    label: 'Bem-estar',
    description: 'Equilíbrio entre corpo e mente',
    icon: 'moon',
  },
];

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    value: 'beginner',
    label: 'Iniciante',
    description: 'Começando agora ou retomando após uma pausa longa',
  },
  {
    value: 'intermediate',
    label: 'Intermediário',
    description: 'Treina com regularidade há alguns meses',
  },
  {
    value: 'advanced',
    label: 'Avançado',
    description: 'Treina consistentemente há mais de um ano',
  },
];

export const ONBOARDING_STEP_LABELS = [
  'Boas-vindas',
  'Dados físicos',
  'Objetivo',
  'Rotina',
  'Resumo',
];
