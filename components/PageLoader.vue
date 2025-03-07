<template>
  <Teleport to="body" :disabled="!isFullPage">
    <Transition
      name="fade"
      enter-active-class="ease-in-out duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in-out duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" :class="classes">
        <div class="relative inline-flex w-8 h-8">
          <div class="rounded-full absolute border-solid border-success-600 border-[4px] w-10 h-10" />
          <div class="rounded-full animate-spin absolute border-solid border-t-transparent border-[4px] w-10 h-10" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  fullPage: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fullPage: true
});

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
}>();

const classes = computed(() => [
  props.fullPage ? 'fixed' : 'absolute',
  'inset-0',
  'flex',
  'justify-center',
  'items-center',
  'bg-gray-300/75',
  props.fullPage ? 'z-[99]' : 'z-[5]'
]);

const isFullPage = computed(() => props.fullPage);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
});

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

async function checkOpen() {
  if (!isOpen.value || !document) {
    return;
  }

  (document.activeElement as HTMLElement)?.blur();
}

watch(isOpen, checkOpen);

defineExpose({
  open,
  close
});

onMounted(checkOpen);
</script>
