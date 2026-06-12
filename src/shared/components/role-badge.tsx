import type { Role } from '@/modules/auth/lib/roles';
import { ROLE_LABELS } from '@/shared/lib/permissions';
import { Badge } from '@/shared/components/ui/badge';

const variantMap: Record<Role, 'pending' | 'founder' | 'evaluator' | 'admin'> = {
  PENDING: 'pending',
  FOUNDER: 'founder',
  EVALUATOR: 'evaluator',
  ADMIN: 'admin',
};

export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant={variantMap[role]}>{ROLE_LABELS[role]}</Badge>;
}
