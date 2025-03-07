export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event);
    const paginationQuery = buildPaginationParams(event);

    const rawResponse = await doRequest({
      method: 'GET',
      url: '/api/v1/products',
      event
    });

    const rawResult = toArray(rawResponse);
    const total = rawResult.length;

    const response = await doRequest({
      method: 'GET',
      url: '/api/v1/products',
      event,
      query: {
        ...q,
        ...paginationQuery
      }
    });

    const result = toArray(response).map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      price: item.price,
      description: item.description,
      images: item.images,
      creationAt: item.creationAt,
      updatedAt: item.updatedAt
    }));

    return {
      rows: result,
      total
    };
  } catch (err: any) {
    throw createError(err);
  }
});
