export default defineEventHandler(async (event) => {
  try {
    const paramId = getRouterParam(event, 'id');

    const response = await doRequest({
      method: 'GET',
      url: '/api/v1/products/'.concat(paramId as string),
      event
    });

    return response;
  } catch (err: any) {
    throw createError(err);
  }
});
