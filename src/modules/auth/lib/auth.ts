import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/modules/auth/lib/auth.config';
import { prisma } from '@/shared/lib/prisma';
import { rateLimit } from '@/shared/lib/rate-limit';
import type { Role } from '@/modules/auth/lib/roles';
import { getClientIp } from '@/shared/lib/security';
import { LoginSchema } from '@/shared/lib/schemas';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role as Role;
        return token;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role as Role;
        }
      }

      return token;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const h = await headers();
        const ip = getClientIp(h);
        const limited = rateLimit(
          `auth-login:${ip}:${parsed.data.email.toLowerCase()}`,
          10,
          60_000,
        );
        if (!limited.ok) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as import('@/modules/auth/lib/roles').Role,
        };
      },
    }),
  ],
});
