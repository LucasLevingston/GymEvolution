export const UserRole = {
  STUDENT: 'STUDENT',
  NUTRITIONIST: 'NUTRITIONIST',
  TRAINER: 'TRAINER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
