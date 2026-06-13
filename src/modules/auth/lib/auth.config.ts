import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@/modules/auth/lib/roles';
import { shouldEnforceHttps } from '@/shared/lib/security';

export const authConfig = {
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  // Required for Auth.js on localhost and behind TLS proxies (separate from cookie security).
  trustHost: true,
  useSecureCookies: shouldEnforceHttps(),
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role as Role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/api/auth')) {
        return true;
      }

      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
