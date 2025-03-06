<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? title + ' | Simple Dahboard' : 'Simple Dashboard')
});
</script>
