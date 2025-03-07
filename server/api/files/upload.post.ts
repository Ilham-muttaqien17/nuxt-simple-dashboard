import FormData from 'form-data';

export default defineEventHandler(async (event) => {
  try {
    const reqBody = await readMultipartFormData(event);

    if (!reqBody) {
      throw createError({
        status: 400,
        statusMessage: 'Invalid file',
        stack: undefined
      });
    }

    const file = reqBody[0];
    const fd = new FormData();
    fd.append('file', file.data, file.name);

    const response = await doRequest({
      event,
      url: '/api/v1/files/upload',
      method: 'POST',
      body: fd,
      isFormData: true
    });

    return response;
  } catch (err: any) {
    throw createError(err);
  }
});
