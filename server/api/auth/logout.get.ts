export default defineEventHandler(async (event) => {
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
});
