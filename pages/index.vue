<template>
  <div class="">
    <span>Dashboard</span>
    <UButton @click="onLogout">Logout</UButton>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
});

const onLogout = async () => {
  try {
    await useRequest('/auth/logout', {
      method: 'GET',
      isCoreAPI: true
    });

    location.replace('/sign-in');
  } catch {
    // nope
  }
};
</script>
