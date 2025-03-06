import type { H3Event } from 'h3';
import { useUserSession } from '~/server/utils/session';

async function logout(event: H3Event) {
  try {
    // Clear session
    const session = await useUserSession(event);
    await session.clear();

    return {
      success: true
    };
  } catch (err: any) {
    throw createError(err);
  }
}

export default logout;
