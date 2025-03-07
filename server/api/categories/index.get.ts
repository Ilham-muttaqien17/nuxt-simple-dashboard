export default defineEventHandler(async (event) => {
  try {
    const response = await doRequest({
      method: 'GET',
      url: '/api/v1/categories',
      event
    });

    const result = toArray(response).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      image: item.image,
      creationAt: item.creationAt,
      updatedAt: item.updatedAt
    }));

    const total = result.length;

    return {
      rows: result,
      total
    };
  } catch (err: any) {
    throw createError(err);
  }
});
