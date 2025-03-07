<template>
  <div class="relative block w-full min-h-screen">
    <div class="relative flex items-center h-screen">
      <Sidebar v-model="sidebarOpen" />
      <div class="relative flex flex-col w-full h-full shadow-md">
        <div class="min-h-[60px] bg-white px-8 py-4 flex items-center justify-between">
          <UIcon name="heroicons:bars-3" size="28" class="flex-shrink-0 text-gray-600 cursor-pointer" @click="toggleSidebar" />
          <UIcon name="heroicons:user-circle-solid" size="40" class="text-gray-400" />
        </div>
        <main class="bg-gray-100 grow px-8 py-10 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>
