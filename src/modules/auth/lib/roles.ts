export const Role = {
  PENDING: 'PENDING',
  FOUNDER: 'FOUNDER',
  EVALUATOR: 'EVALUATOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLE_LABELS: Record<Role, string> = {
  PENDING: 'Ожидание',
  FOUNDER: 'Основатель',
  EVALUATOR: 'Оценщик',
  ADMIN: 'Админ',
};
