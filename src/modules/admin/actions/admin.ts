'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { Role } from '@/modules/auth/lib/roles';
import { prisma } from '@/shared/lib/prisma';
import { canManageRoles } from '@/shared/lib/permissions';
import { rateLimit } from '@/shared/lib/rate-limit';
import { ChangeRoleSchema, CreateEvaluatorSchema } from '@/shared/lib/schemas';
import { authWithFreshRole } from '@/modules/auth/lib/session';

type ActionState = { error?: string; success?: boolean };

export async function createEvaluatorAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await authWithFreshRole();
  if (!session?.user || !canManageRoles(session.user.role)) {
    return { error: 'Нет прав' };
  }

  const limited = rateLimit(`admin-create:${session.user.id}`, 10, 60_000);
  if (!limited.ok) {
    return { error: 'Слишком много запросов. Попробуйте позже.' };
  }

  const parsed = CreateEvaluatorSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: 'Проверьте введённые данные' };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: 'Пользователь с таким email уже существует' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: Role.EVALUATOR,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/users');
  return { success: true };
}

export async function changeRoleAction(formData: FormData) {
  const session = await authWithFreshRole();
  if (!session?.user || !canManageRoles(session.user.role)) {
    return { error: 'Нет прав' };
  }

  const limited = rateLimit(`admin-role:${session.user.id}`, 30, 60_000);
  if (!limited.ok) {
    return { error: 'Слишком много запросов. Попробуйте позже.' };
  }

  const parsed = ChangeRoleSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });
  if (!parsed.success) {
    return { error: 'Некорректные данные' };
  }

  if (parsed.data.userId === session.user.id && parsed.data.role !== Role.ADMIN) {
    return { error: 'Нельзя снять с себя роль админа' };
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  revalidatePath('/admin/users');
  return { success: true };
}
