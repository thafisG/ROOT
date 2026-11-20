import { ExperienceLevel, FitnessGoal } from '../onboarding/models/onboarding.models';

export interface WorkoutDraft {
  name: string;
  exercises: string[];
}

export interface WorkoutPlanAnswers {
  goal: FitnessGoal;
  daysPerWeek: number;
  experienceLevel: ExperienceLevel;
  sessionMinutes: 30 | 45 | 60;
}

export const WORKOUT_PRESETS: WorkoutDraft[] = [
  {
    name: 'Corpo todo · iniciante',
    exercises: [
      'Leg press — 2×10',
      'Supino máquina — 2×10',
      'Remada baixa — 2×10',
      'Mesa flexora — 2×12',
    ],
  },
  {
    name: 'Superior · força',
    exercises: [
      'Supino reto — 3×8',
      'Remada baixa — 3×10',
      'Desenvolvimento — 3×10',
      'Puxada frontal — 3×10',
      'Rosca bíceps — 2×12',
    ],
  },
  {
    name: 'Inferior · força',
    exercises: [
      'Agachamento goblet — 3×10',
      'Leg press — 3×10',
      'Mesa flexora — 3×12',
      'Elevação pélvica — 3×10',
      'Panturrilha — 3×12',
    ],
  },
  {
    name: 'Treino rápido · 30 min',
    exercises: [
      'Agachamento com halteres — 3×10',
      'Supino máquina — 3×10',
      'Remada baixa — 3×10',
      'Caminhada leve — 8 min',
    ],
  },
];

const exerciseLibraries: Record<FitnessGoal, string[]> = {
  strength: [
    'Agachamento livre',
    'Supino reto',
    'Remada curvada',
    'Terra romeno',
    'Desenvolvimento',
    'Puxada frontal',
    'Leg press',
    'Mesa flexora',
    'Elevação lateral',
    'Prancha',
  ],
  general_health: [
    'Agachamento goblet',
    'Supino máquina',
    'Remada baixa',
    'Elevação pélvica',
    'Desenvolvimento máquina',
    'Puxada frontal',
    'Leg press',
    'Mesa flexora',
    'Caminhada leve',
    'Prancha',
  ],
  weight_loss: [
    'Leg press',
    'Supino máquina',
    'Remada baixa',
    'Terra romeno',
    'Step-up baixo',
    'Puxada frontal',
    'Agachamento goblet',
    'Mesa flexora',
    'Bicicleta ergométrica',
    'Prancha',
  ],
  mobility: [
    'Agachamento goblet',
    'Supino máquina',
    'Remada baixa',
    'Mobilidade de quadril',
    'Desenvolvimento leve',
    'Puxada frontal',
    'Leg press',
    'Alongamento dinâmico',
    'Caminhada leve',
    'Prancha',
  ],
  wellbeing: [
    'Agachamento goblet',
    'Supino máquina',
    'Remada baixa',
    'Elevação pélvica',
    'Desenvolvimento máquina',
    'Puxada frontal',
    'Leg press',
    'Mesa flexora',
    'Caminhada leve',
    'Respiração e alongamento',
  ],
};

const splitTemplates: Record<number, { name: string; exerciseIndexes: number[] }[]> = {
  1: [{ name: 'Corpo todo A', exerciseIndexes: [0, 1, 2, 7, 9, 8] }],
  2: [
    { name: 'Corpo todo A', exerciseIndexes: [0, 1, 2, 7, 9, 8] },
    { name: 'Corpo todo B', exerciseIndexes: [6, 5, 3, 4, 9, 8] },
  ],
  3: [
    { name: 'Corpo todo A', exerciseIndexes: [0, 1, 2, 7, 9, 8] },
    { name: 'Corpo todo B', exerciseIndexes: [6, 5, 3, 4, 9, 8] },
    { name: 'Corpo todo C', exerciseIndexes: [0, 5, 1, 3, 7, 9] },
  ],
  4: [
    { name: 'Superior A', exerciseIndexes: [1, 2, 4, 5, 8, 9] },
    { name: 'Inferior A', exerciseIndexes: [0, 6, 7, 3, 9, 8] },
    { name: 'Superior B', exerciseIndexes: [1, 5, 2, 4, 8, 9] },
    { name: 'Inferior B', exerciseIndexes: [6, 0, 3, 7, 8, 9] },
  ],
  5: [
    { name: 'Superior A', exerciseIndexes: [1, 2, 4, 5, 8, 9] },
    { name: 'Inferior A', exerciseIndexes: [0, 6, 7, 3, 9, 8] },
    { name: 'Empurrar', exerciseIndexes: [1, 4, 8, 0, 9, 3] },
    { name: 'Puxar', exerciseIndexes: [2, 5, 3, 7, 9, 8] },
    { name: 'Pernas', exerciseIndexes: [0, 6, 7, 3, 8, 9] },
  ],
};

export function generateWorkoutPlan(answers: WorkoutPlanAnswers): WorkoutDraft[] {
  const days = Math.max(1, Math.min(7, Math.round(answers.daysPerWeek)));
  const templates = splitTemplates[days] ?? splitTemplates[5];
  const library = exerciseLibraries[answers.goal];
  const exerciseLimit = answers.sessionMinutes === 30 ? 4 : answers.sessionMinutes === 45 ? 5 : 6;
  const sets = answers.experienceLevel === 'beginner' ? 2 : answers.experienceLevel === 'advanced' ? 4 : 3;
  const reps = answers.goal === 'strength' ? '6–8' : '8–12';

  return templates.map((template) => ({
    name: `${template.name} · ${answers.sessionMinutes} min`,
    exercises: template.exerciseIndexes.slice(0, exerciseLimit).map((index) => {
      const exercise = library[index];
      if (/caminhada|bicicleta|alongamento|mobilidade|respiração/i.test(exercise)) {
        return `${exercise} — 8 min`;
      }
      return `${exercise} — ${sets}×${reps}`;
    }),
  }));
}
