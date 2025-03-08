<template>
  <aside
    class="h-full w-72 fixed flex-shrink-0 bg-white text-sm px-4 py-6 overflow-y-scroll scroll-mini transition-all duration-300 ease-in-out z-40 select-none shadow-md"
    :class="[modelValue ? 'left-0' : '-left-72']"
  >
    <div class="relative flex flex-col justify-between w-full h-full">
      <div class="relative flex flex-col gap-1 w-full">
        <NuxtLink v-for="(menu, i) in menus" :key="`menu-${i}`" class="relative w-full group" :to="menu.path">
          <div
            class="flex items-center gap-4 w-full p-4 rounded group-hover:bg-success-700 group-hover:text-white"
            :class="[isActiveMenu(menu.pages) ? 'bg-success-700 text-white' : 'bg-white']"
          >
            <span class="flex flex-shrink-0">
              <UIcon :name="menu.icon" size="24" />
            </span>
            <span class="grow truncate">{{ menu.label }}</span>
          </div>
          <div
            class="group-hover:opacity-100 bg-success-700 absolute -left-8 inset-y-0 w-[20px] rounded"
            :class="[isActiveMenu(menu.pages) ? 'opacity-100' : 'opacity-0']"
          />
        </NuxtLink>
      </div>

      <div class="border-t pt-4">
        <div class="relative w-full group cursor-pointer" @click="onLogout">
          <div class="flex items-center gap-4 w-full p-4 rounded group-hover:bg-success-700 group-hover:text-white">
            <span class="flex flex-shrink-0">
              <UIcon name="heroicons:arrow-left-end-on-rectangle" size="24" />
            </span>
            <span class="grow">Logout</span>
          </div>
          <div class="opacity-0 group-hover:opacity-100 bg-success-700 absolute -left-8 inset-y-0 w-[20px] rounded" />
        </div>
      </div>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { menus } from '~/data/menu';

const modelValue = defineModel<boolean>();

const route = useRoute();

const isActiveMenu = (pages: string[]) => {
  return pages.includes(route.name as string);
};

/* Logout */
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
<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background: transparent;
}

@media screen and (max-width: 600px) {
  ::-webkit-scrollbar {
    width: 2spx;
    height: 5px;
  }
}

::-webkit-scrollbar-thumb {
  background: #303031;
  /* border: 3px solid #fff; */
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bbbcbd;
}

::-webkit-scrollbar-thumb:active {
  background: #707070;
}

@media screen and (max-width: 600px) {
  ::-webkit-scrollbar-thumb {
    border-width: 1px;
  }
}
</style>
