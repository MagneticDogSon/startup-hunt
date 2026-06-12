import { Role } from '@/modules/auth/lib/roles';

export function canViewStartups(role: Role): boolean {
  return role === Role.FOUNDER || role === Role.EVALUATOR || role === Role.ADMIN;
}

export function canCreateStartup(role: Role): boolean {
  return role === Role.FOUNDER;
}

export function canEditStartup(
  role: Role,
  userId: string,
  authorId: string,
): boolean {
  if (role === Role.ADMIN) return true;
  if (role === Role.FOUNDER && userId === authorId) return true;
  return false;
}

export function canDeleteStartup(
  role: Role,
  userId: string,
  authorId: string,
): boolean {
  return canEditStartup(role, userId, authorId);
}

export function canVote(role: Role): boolean {
  return role === Role.EVALUATOR || role === Role.FOUNDER;
}

export function canVoteOnStartup(userId: string, authorId: string): boolean {
  return userId !== authorId;
}

export function canComment(role: Role): boolean {
  return role === Role.EVALUATOR;
}

export function canReplyToComments(userId: string, authorId: string): boolean {
  return userId === authorId;
}

export function canManageRoles(role: Role): boolean {
  return role === Role.ADMIN;
}

export { ROLE_LABELS } from '@/modules/auth/lib/roles';
