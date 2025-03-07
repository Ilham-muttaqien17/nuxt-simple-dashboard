import { UpdateProduct, type TUpdateProduct } from '~/scheme/product';

export default defineEventHandler(async (event) => {
  try {
    const paramId = getRouterParam(event, 'id');

    const parsedBody = await useValidator<TUpdateProduct>({
      event,
      schema: UpdateProduct
    });

    await doRequest({
      event,
      url: '/api/v1/products/'.concat(paramId as string),
      method: 'PUT',
      body: parsedBody
    });

    return {
      success: true
    };
  } catch (err: any) {
    throw createError(err);
  }
});
