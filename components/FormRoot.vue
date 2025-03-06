<template>
  <form @submit.prevent="onSubmit">
    <slot />
  </form>
</template>
<script setup lang="ts">
import type { FormError } from '~/types/error';

const emit = defineEmits<{
  (e: 'submit', event: SubmitEvent): void;
}>();

const error = ref<FormError[] | null>();

/**
 * Submit Event
 * @param e Event
 */
function onSubmit(e: SubmitEvent | Event) {
  emit('submit', e as SubmitEvent);
}

/**
 * Set error value
 * @param values
 */
function setErrors(values: FormError[]) {
  error.value = values;
}

/**
 * Clear error value
 */
function clearError() {
  error.value = null;
}

provide('form-error', error);

defineExpose({
  error,
  setErrors,
  clearError
});
</script>
