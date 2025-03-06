export default defineNuxtRouteMiddleware(() => {
  try {
    const auth = useStateAuth();

    if (auth.value) {
      return navigateTo('/');
    }
  } catch (err: any) {
    abortNavigation(err);
  }
});
