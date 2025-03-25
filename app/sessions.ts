import { createCookieSessionStorage } from '@remix-run/node';
import { UserRole } from './types/usuarios.types';

type SessionData = {
  userId: string;
  role: UserRole;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',

      // Expires can also be set (although maxAge overrides it when used in combination).
      httpOnly: true,
      maxAge: 6000,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.AUTH_SECRET!],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
