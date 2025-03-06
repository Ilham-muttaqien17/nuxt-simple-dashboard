export default defineNuxtPlugin(async (nuxtApp) => {
  const event = nuxtApp.ssrContext?.event;

  if (!event) {
    return;
  }

  const auth = useStateAuth();

  if (event.context.session) {
    auth.value = event.context.session;
  }
});
