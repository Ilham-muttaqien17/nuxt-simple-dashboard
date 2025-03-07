import { doRequest } from '~/server/utils/request';

export default defineEventHandler(async (event) => {
  try {
    const paramId = getRouterParam(event, 'id');

    await doRequest({
      method: 'DELETE',
      url: '/api/v1/products/'.concat(paramId as string),
      event
    });

    return {
      success: true
    };
  } catch (err: any) {
    throw createError(err);
  }
});
