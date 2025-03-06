<template>
  <div class="relative flex items-center justify-center bg-gray-100 h-screen">
    <FormRoot
      ref="formRef"
      class="bg-white max-w-[90vw] sm:max-w-[60vw] lg:max-w-[40vw] xl:max-w-[30vw] w-screen flex flex-col px-10 py-12 sm:px-16 sm:py-20 rounded-lg shadow-md"
      @submit="onSubmit"
    >
      <h1 class="text-3xl sm:text-4xl font-medium text-center">Login to Account</h1>
      <span class="text-gray-500 text-xs sm:text-sm mt-4 text-center">Please enter your email and password to continue</span>
      <div class="flex flex-col gap-6 mt-12">
        <FormField label="Email" field-error="email">
          <UInput v-model="form.data.email" placeholder="Enter your email" size="lg" />
        </FormField>
        <FormField label="Password" field-error="password">
          <UInput v-model="form.data.password" type="password" placeholder="***********" size="lg" />
        </FormField>
        <UButton block type="submit" size="lg" :loading="form.loading">Sign In</UButton>
      </div>
    </FormRoot>
  </div>
</template>
<script setup lang="ts">
import type { TLoginForm } from '~/scheme/login';

definePageMeta({
  middleware: ['unauth'],
  layout: 'blank'
});

useHead({
  title: 'Sign In'
});

const toast = useToast();

const formRef = ref();
const form = ref({
  data: {
    email: '',
    password: ''
  } satisfies TLoginForm,
  loading: false
});

const onSubmit = async () => {
  try {
    formRef.value.clearError();
    form.value.loading = true;
    await useTimeout(250);
    await useRequest('/auth/login', {
      method: 'POST',
      body: { ...form.value.data },
      isCoreAPI: true
    });

    toast.add({ title: 'Login successfully', color: 'primary' });
    location.replace('/');
  } catch (err: any) {
    useRequestError(err, formRef);
  } finally {
    form.value.loading = false;
  }
};
</script>
