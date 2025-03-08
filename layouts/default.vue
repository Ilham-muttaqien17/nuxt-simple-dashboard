<template>
  <div class="relative block w-full min-h-screen">
    <div class="relative flex items-center h-screen">
      <Sidebar v-model="sidebarOpen" />
      <div
        class="flex flex-col w-full h-full shadow-md fixed transition-all duration-300 ease-in-out"
        :class="[sidebarOpen ? 'left-72' : 'left-0']"
      >
        <div
          class="min-h-[60px] bg-white px-8 py-4 flex items-center justify-between transition-all duration-300"
          :class="[sidebarOpen ? 'mr-72' : 'mr-0']"
        >
          <UIcon name="heroicons:bars-3" size="28" class="flex-shrink-0 text-gray-600 cursor-pointer" @click="toggleSidebar" />
          <UIcon name="heroicons:user-circle-solid" size="40" class="text-gray-400" />
        </div>
        <main class="relative h-full transition-all duration-300" :class="[sidebarOpen ? 'mr-72' : 'mr-0']">
          <div class="relative bg-gray-100 px-8 py-10 max-h-[calc(100vh_-_4rem)] h-full transition-none overflow-auto">
            <slot />
          </div>
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
