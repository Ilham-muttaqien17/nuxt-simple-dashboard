export default defineNuxtRouteMiddleware(() => {
  try {
    const auth = useStateAuth();

    if (!auth.value) {
      auth.value = null;

      if (typeof window !== 'undefined') {
        window.location.replace('/sign-in');
        return;
      }

      return navigateTo('/sign-in');
    }
  } catch (err: any) {
    abortNavigation(err);
  }
});
