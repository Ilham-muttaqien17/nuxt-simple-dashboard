import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '~/constants';
import { LoginForm, type TLoginForm } from '~/scheme/login';

export default defineEventHandler(async (event) => {
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
        exp: ACCESS_TOKEN_EXPIRY
      },
      refreshToken: {
        value: response.access_token,
        exp: REFRESH_TOKEN_EXPIRY
      }
    };

    // Set session
    const session = await useUserSession(event, ACCESS_TOKEN_EXPIRY);
    await session.clear();
    await session.update({ token });

    return {
      success: true
    };
  } catch (err: any) {
    throw createError(err);
  }
});
