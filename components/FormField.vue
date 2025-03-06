<template>
  <div class="relative block space-y-1">
    <div v-if="props.label" class="tx-caption-1 font-medium text-gray-800 flex items-center gap-1">
      {{ props.label }}
    </div>
    <div class="relative">
      <slot />
      <Transition
        name="custom-slide-down"
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <span v-if="error" class="text-red-800 text-xs w-full">{{ error }}</span>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormError } from '~/types/error';

interface Props {
  label?: string;
  fieldError?: string;
}

const props = defineProps<Props>();

const errors = inject<Ref<FormError[]> | null>('form-error', null);

const error = computed(() => {
  if (
    !props.fieldError ||
    !errors ||
    (props.fieldError && !Array.isArray(errors.value) && typeof errors.value !== 'object') ||
    (props.fieldError && !Array.isArray(errors.value) && errors.value === null)
  ) {
    return '';
  }

  if (Array.isArray(errors.value)) {
    return errors.value.find((err) => err?.path === props.fieldError)?.message ?? '';
  }

  return errors.value[props.fieldError] ?? '';
});
</script>
