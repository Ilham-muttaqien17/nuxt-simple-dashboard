<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { UNotifications } from '#components';

useHead({
  titleTemplate: (title) => (title ? title + ' | Simple Dahboard' : 'Simple Dashboard')
});
</script>
