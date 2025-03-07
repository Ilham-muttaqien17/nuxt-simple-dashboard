import { CreateProduct, type TCreateProduct } from '~/scheme/product';

export default defineEventHandler(async (event) => {
  try {
    const parsedBody = await useValidator<TCreateProduct>({
      event,
      schema: CreateProduct
    });

    await doRequest({
      event,
      url: '/api/v1/products',
      method: 'POST',
      body: parsedBody
    });

    return {
      success: true
    };
  } catch (err: any) {
    throw createError(err);
  }
});
