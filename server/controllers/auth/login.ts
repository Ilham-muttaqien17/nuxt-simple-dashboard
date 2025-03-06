import type { H3Event } from 'h3';
import { LoginForm, type TLoginForm } from '~/scheme/login';
import { doRequest } from '~/server/utils/request';
import { useUserSession } from '~/server/utils/session';
import { useValidator } from '~/server/utils/validator';

async function login(event: H3Event) {
  try {
    const parsedBody = await useValidator<TLoginForm>({
      event,
      schema: LoginForm
    });

    const response = await doRequest({
      event,
      url: '/api/v1/auth/login',
      method: 'POST',
      body: parsedBody
    });

    // Switch token value between access_token and refresh_token from response
    const token = {
      accessToken: {
        value: response.refresh_token,
        exp: 60 * 60 * 10 // Set exp for 10 Hours
      },
      refreshToken: {
        value: response.access_token,
        exp: 60 * 60 * 24 * 20 // Set exp for 20 Days
      }
    };

    // Set session
    const session = await useUserSession(event, 60 * 60 * 24 * 20);
    await session.update({ token });

    return {
      success: true
    };
  } catch (err: any) {
    throw createError(err);
  }
}

export default login;
