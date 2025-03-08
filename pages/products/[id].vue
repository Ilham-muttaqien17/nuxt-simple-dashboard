<template>
  <div class="relative flex flex-col gap-6">
    <TitleHeading>{{ !isUpdate ? 'Create' : 'Edit' }} Product</TitleHeading>
    <CardContainer>
      <FormRoot ref="formRef" class="flex flex-col" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField label="Title" field-error="title">
            <UInput v-model="form.title" placeholder="Title" size="lg" color="success" />
          </FormField>
          <FormField label="Price" field-error="price">
            <UInput v-model="form.price" placeholder="0" size="lg" color="success" type="number" />
          </FormField>
          <FormField label="Category" field-error="categoryId">
            <USelect
              v-model="form.categoryId"
              :options="categories"
              placeholder="Select category"
              size="lg"
              value-attribute="id"
              option-attribute="name"
              color="success"
            />
          </FormField>
          <FormField label="Images" field-error="images" class="row-span-2">
            <UInput
              v-model="files"
              placeholder="0"
              size="lg"
              color="success"
              type="file"
              accept="image/png"
              @change="onSelectedFile"
            />
            <div class="flex flex-wrap gap-2 text-xs mt-4">
              <div
                v-for="(img, k) in form.images"
                :key="`img-${k}`"
                class="flex items-center gap-2 bg-gray-100 px-4 py-1 rounded-full w-fit cursor-pointer"
                @click="onDownloadImage(img)"
              >
                <span>{{ img }}</span>
                <UIcon name="heroicons:x-mark" class="flex-shrink-0" @click.stop="onRemoveImage(k)" />
              </div>
            </div>
          </FormField>
          <FormField label="Description" field-error="description">
            <UTextarea v-model="form.description" placeholder="Description" size="lg" color="success" />
          </FormField>
        </div>
        <div class="flex items-center gap-4 mt-6 ml-auto">
          <UButton icon="heroicons:x-mark" size="lg" color="gray" @click="router.push('/products')">Cancel</UButton>
          <UButton icon="heroicons:document-text" size="lg" color="success" type="submit">Save Product</UButton>
        </div>
      </FormRoot>
    </CardContainer>

    <!-- Confirm Modal -->
    <UModal v-model="modal.confirm.open">
      <div class="flex flex-col px-6 py-4">
        <h3 class="text-xl font-semibold">Confirm {{ !isUpdate ? 'Create' : 'Edit' }} Product</h3>
        <span class="mt-4">Are you sure want to {{ !isUpdate ? 'create' : 'edit' }} this product?</span>
        <div class="flex flex-col sm:flex-row-reverse gap-4 mt-8">
          <UButton size="lg" color="danger" :ui="{ base: 'justify-center' }" :loading="modal.confirm.loading" @click="onSubmit">
            Confirm
          </UButton>
          <UButton size="lg" color="gray" :ui="{ base: 'justify-center' }" @click="cancelSubmit">Cancel</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import type { TCreateProduct } from '~/scheme/product';
import type { Category } from '~/types/category';
import type { Product } from '~/types/product';
import type { DataTableResponse } from '~/types/ui/table';

definePageMeta({
  layout: 'default',
  middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const loader = useLoader();
const toast = useToast();

const detailId = computed(() => route.params.id as string);
const isUpdate = computed(() => detailId.value !== 'add');

useHead({
  title: `${!isUpdate.value ? 'Create' : 'Update'} Product`
});

const formRef = ref();
const files = ref();
const categories = ref<Category[]>();
const form = ref<TCreateProduct>({
  title: '',
  price: 0,
  description: '',
  images: [] as string[],
  categoryId: 0
});
const modal = ref({
  confirm: {
    open: false,
    loading: false,
    selectedId: ''
  }
});

const basePath = '/products/';

// Fetch detail product
const fetchDetail = async () => {
  try {
    const response = await useRequest<Product>(basePath.concat(detailId.value), {
      method: 'GET',
      isCoreAPI: true
    });

    form.value.title = response.title;
    form.value.price = response.price;
    form.value.description = response.description;
    form.value.images = response.images;
    form.value.categoryId = response.category.id;
  } catch (err: any) {
    useRequestError(err);
  }
};

// Fetch category list
const fetchCategories = async () => {
  try {
    const response = await useRequest<DataTableResponse<Category>>('/categories', {
      method: 'GET',
      isCoreAPI: true
    });

    categories.value = response.rows;
  } catch (err: any) {
    useRequestError(err);
  }
};

// Submit form
const onSubmit = async () => {
  try {
    if (!modal.value.confirm.open) {
      modal.value.confirm.open = true;
      return;
    }

    modal.value.confirm.loading = true;
    await useRequest('/products'.concat(!isUpdate.value ? '' : `/${detailId.value}`), {
      method: !isUpdate.value ? 'POST' : 'PUT',
      body: form.value,
      isCoreAPI: true
    });
    modal.value.confirm.open = false;
    toast.add({ title: `Product ${!isUpdate.value ? 'created' : 'updated'} successfully`, color: 'success' });
    router.push('/products');
  } catch (err: any) {
    useRequestError(err, formRef);
    modal.value.confirm.open = false;
  } finally {
    modal.value.confirm.loading = false;
  }
};

/**
 * Upload selected file
 * @param files
 */
const onSelectedFile = async (fileList: FileList) => {
  try {
    loader.open();
    const file = fileList.item(0);
    const fd = new FormData();
    fd.append('file', file as File);
    const response = await useRequest('/files/upload', {
      method: 'POST',
      body: fd,
      isCoreAPI: true
    });

    form.value.images = [...form.value.images, response.location as string];
    files.value = null;
  } catch (err: any) {
    useRequestError(err);
  } finally {
    loader.close();
  }
};

/**
 * Download Image
 * @param path - string
 */
const onDownloadImage = (path: string) => {
  useDownloadLink(path, '', true);
};

/**
 * Remove image from list
 * @param idx - number
 */
const onRemoveImage = (idx: number) => {
  form.value.images.splice(idx, 1);
};

// Cancel & close confirm modal
const cancelSubmit = () => {
  modal.value.confirm.selectedId = '';
  modal.value.confirm.open = false;
};

onMounted(async () => {
  loader.open();
  if (isUpdate.value) {
    await fetchDetail();
  }
  await fetchCategories();
  loader.close();
});
</script>
