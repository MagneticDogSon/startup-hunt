'use server';

import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/modules/auth/lib/roles';
import { signIn, signOut } from '@/modules/auth/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { rateLimit } from '@/shared/lib/rate-limit';
import { getClientIp } from '@/shared/lib/security';
import { RegisterSchema } from '@/shared/lib/schemas';

async function createUser(
  data: {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
  },
  options: { requestedRole?: string; redirectBase: string },
) {
  const h = await headers();
  const limited = rateLimit(`register:${getClientIp(h)}`, 5, 60_000);
  if (!limited.ok) {
    redirect(`${options.redirectBase}?error=rate`);
  }

  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    redirect(`${options.redirectBase}?error=validation`);
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    redirect(`${options.redirectBase}?error=exists`);
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: Role.PENDING,
      requestedRole: options.requestedRole,
    },
  });
}

function readRegisterFields(formData: FormData) {
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };
}

export async function registerFounderAction(formData: FormData) {
  await createUser(readRegisterFields(formData), {
    redirectBase: '/register/founder',
    requestedRole: Role.FOUNDER,
  });
  redirect('/login?registered=founder');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const h = await headers();
  const limited = rateLimit(
    `login:${getClientIp(h)}:${email.toLowerCase()}`,
    10,
    60_000,
  );
  if (!limited.ok) {
    redirect('/login?error=rate');
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/startups',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('NEXT_REDIRECT')) throw error;
    redirect('/login?error=invalid');
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/login' });
}
