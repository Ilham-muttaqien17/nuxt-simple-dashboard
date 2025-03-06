import dayjs from 'dayjs';
import type { H3Event } from 'h3';
import type { UserSessionConfig, UserSessionData } from '~/types/session';

const exp = 60 * 60 * 10; // 10 Hours

const userSessionConfig: UserSessionConfig = {
  name: 'user_session',
  cookie: {
    sameSite: 'lax',
    httpOnly: true,
    secure: false,
    path: '/'
  },
  maxAge: exp,
  sessionHeader: false,
  password: 'gdum9$98y*G8KXfb#YNBM1@uuWIjof+Azq123faa'
};

export async function useUserSession(event: H3Event, expiry: number = exp) {
  const session = await useSession<UserSessionData>(event, {
    ...userSessionConfig,
    maxAge: expiry
  });

  return session;
}

/**
 * Get user session from cookie value
 * @param event - H3Event
 * @returns object
 */
export async function getUserSession(event: H3Event): Promise<UserSessionData | null> {
  try {
    const cookie = getCookie(event, userSessionConfig.name);
    const session = typeof cookie === 'string' ? await unsealSession(event, userSessionConfig, cookie) : null;
    if (!session) {
      return null;
    }

    const sessData = session.data as UserSessionData;
    const createdAt = session.createdAt as number;
    const maxAge = userSessionConfig.maxAge * 1000;
    const cookieValue = {
      id: session.id as string,
      name: userSessionConfig.name,
      created_at: createdAt,
      expired_at: dayjs(sessData.token.accessToken.exp).isValid()
        ? dayjs(sessData.token.accessToken.exp).valueOf()
        : new Date(createdAt + maxAge).valueOf()
    };

    const data = {
      ...sessData,
      cookie: cookieValue
    };

    return data;
  } catch {
    return null;
  }
}
