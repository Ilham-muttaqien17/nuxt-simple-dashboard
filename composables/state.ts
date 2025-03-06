import type { UserSessionData } from '~/types/session';

/**
 * Auth state
 * @returns
 */
export function useStateAuth() {
  return useState<UserSessionData | null>('auth', () => null);
}
