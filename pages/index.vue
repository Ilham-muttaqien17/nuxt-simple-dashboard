<template>
  <div class="relative block">
    <TitleHeading>Dashboard</TitleHeading>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
});
</script>
