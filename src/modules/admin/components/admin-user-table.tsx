'use client';

import type { Role } from '@/modules/auth/lib/roles';
import { changeRoleAction } from '@/modules/admin/actions/admin';
import { ROLE_LABELS } from '@/shared/lib/permissions';
import { RoleBadge } from '@/shared/components/role-badge';
import { Button } from '@/shared/components/ui/button';
import { Select } from '@/shared/components/ui/select';
import { useState } from 'react';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  requestedRole: string | null;
  createdAt: Date;
};

export function AdminUserTable({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [roles, setRoles] = useState<Record<string, Role>>(
    Object.fromEntries(users.map((u) => [u.id, u.role])),
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(userId: string) {
    const formData = new FormData();
    formData.set('userId', userId);
    formData.set('role', roles[userId]);
    const result = await changeRoleAction(formData);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage('Роль обновлена');
      setTimeout(() => setMessage(null), 2000);
    }
  }

  return (
    <div>
      {message && (
        <p className="mb-4 text-sm text-muted">{message}</p>
      )}
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Имя</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Роль</th>
              <th className="px-4 py-3 text-left font-medium">Запрос</th>
              <th className="px-4 py-3 text-left font-medium">Действие</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={roles[user.id]} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {user.requestedRole && user.requestedRole in ROLE_LABELS
                    ? ROLE_LABELS[user.requestedRole as Role]
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={roles[user.id]}
                      onChange={(e) =>
                        setRoles((prev) => ({
                          ...prev,
                          [user.id]: e.target.value as Role,
                        }))
                      }
                      disabled={user.id === currentUserId}
                    >
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(user.id)}
                      disabled={user.id === currentUserId}
                    >
                      Сохранить
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
