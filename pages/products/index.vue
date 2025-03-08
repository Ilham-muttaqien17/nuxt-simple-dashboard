<template>
  <div class="relative flex flex-col gap-6">
    <TitleHeading>Product Page</TitleHeading>
    <CardContainer>
      <div class="flex flex-col gap-4 w-full">
        <div class="relative block space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <UButton icon="heroicons:plus" color="success" size="lg" @click="navigateToForm('add')">Add Product</UButton>
          <UInput
            v-model="filter.title"
            icon="heroicons:magnifying-glass-20-solid"
            size="lg"
            color="success"
            :trailing="false"
            placeholder="Search..."
            @update:model-value="onSearch"
          />
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-end gap-4">
          <FormField label="Category">
            <USelect
              v-model="filter.categoryId"
              :options="categories"
              placeholder="Select category"
              size="lg"
              class="min-w-[150px]"
              value-attribute="id"
              option-attribute="name"
              color="success"
            />
          </FormField>
          <FormField label="Price">
            <UInput v-model="filter.price" placeholder="0" size="lg" color="success" type="number" />
          </FormField>
          <FormField label="Range">
            <div class="flex items-center gap-4">
              <UInput v-model="filter.price_min" placeholder="0" size="lg" color="success" type="number" />
              <span class="text-sm text-gray-800">to</span>
              <UInput v-model="filter.price_max" placeholder="0" size="lg" color="success" type="number" />
            </div>
          </FormField>
          <UButton icon="heroicons:funnel" color="indigo" size="lg" @click="resetTable">Filter</UButton>
        </div>
      </div>
      <div class="w-full overflow-x-auto mt-4">
        <UTable
          :rows="dataTable.rows"
          :columns="columns"
          :loading="dataTable.loading"
          :ui="{
            td: {
              base: 'max-w-[200px] truncate'
            }
          }"
        >
          <template #category-data="{ row }">
            <span>{{ row.category.name }}</span>
          </template>
          <template #creationAt-data="{ row }">
            <span>{{ useDayjs(row.creationAt).format('DD/MM/YYYY') }}</span>
          </template>
          <template #updatedAt-data="{ row }">
            <span>{{ useDayjs(row.updatedAt).format('DD/MM/YYYY') }}</span>
          </template>
          <template #action-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton icon="heroicons:pencil-square" color="warning" @click="navigateToForm(row.id)" />
              <UButton icon="heroicons:trash" color="danger" @click="openConfirmDelete(row.id)" />
            </div>
          </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
          <UPagination
            v-model="dataTable.page"
            :page-count="dataTable.limit"
            :total="dataTable.total"
            :max="5"
            :active-button="{ color: 'success' }"
            @update:model-value="onPageChange"
          />
        </div>
      </div>
    </CardContainer>

    <!-- Confirm Delete Modal -->
    <UModal v-model="modal.delete.open">
      <div class="flex flex-col px-6 py-4">
        <h3 class="text-xl font-semibold">Confirm Delete Product</h3>
        <span class="mt-4">Are you sure want to delete this product?</span>
        <div class="flex flex-col sm:flex-row-reverse gap-4 mt-8">
          <UButton size="lg" color="danger" :ui="{ base: 'justify-center' }" :loading="modal.delete.loading" @click="deleteProduct">
            Confirm
          </UButton>
          <UButton size="lg" color="gray" :ui="{ base: 'justify-center' }" @click="cancelDelete">Cancel</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import type { DataTableResponse, TableColumn } from '~/types/ui/table';
import { useDebounceFn } from '@vueuse/core';
import type { Product } from '~/types/product';
import type { Category } from '~/types/category';

definePageMeta({
  layout: 'default',
  middleware: 'auth'
});

useHead({
  title: 'List Product'
});

const columns: TableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description', tdClass: 'max-w-[200px] truncate' },
  { key: 'creationAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'action', label: 'Action' }
];

const router = useRouter();
const toast = useToast();
const loader = useLoader();

const categories = ref<Category[]>();
const dataTable = ref({
  rows: [] as Product[],
  total: 0,
  loading: false,
  page: 1,
  limit: 5
});

const filter = ref({
  title: '',
  price: '',
  price_min: undefined,
  price_max: undefined,
  categoryId: undefined
});

const modal = ref({
  delete: {
    open: false,
    loading: false,
    selectedId: ''
  }
});

// Fetch product list
const fetchProduct = async () => {
  try {
    dataTable.value.loading = true;
    const response = await useRequest<DataTableResponse<Product>>('/products', {
      method: 'GET',
      query: {
        page: dataTable.value.page,
        limit: dataTable.value.limit,
        ...filter.value
      },
      isCoreAPI: true
    });

    dataTable.value.rows = response.rows;
    dataTable.value.total = response.total;
  } catch (err: any) {
    useRequestError(err);
  } finally {
    dataTable.value.loading = false;
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

// Reset table
const resetTable = async () => {
  dataTable.value.rows = [];
  dataTable.value.page = 1;
  dataTable.value.total = 1;
  fetchProduct();
};

const onPageChange = async () => {
  dataTable.value.rows = [];
  fetchProduct();
};

const onSearch = useDebounceFn(() => {
  resetTable();
}, 500);

const deleteProduct = async () => {
  try {
    modal.value.delete.loading = true;
    await useTimeout(200);
    await useRequest('/products/'.concat(modal.value.delete.selectedId), {
      method: 'DELETE',
      isCoreAPI: true
    });
    toast.add({ title: 'Product deleted successfully', color: 'success' });
    modal.value.delete.open = false;
    await resetTable();
  } catch (err: any) {
    useRequestError(err);
  } finally {
    modal.value.delete.loading = false;
  }
};

const navigateToForm = (id: string) => {
  router.push('/products/'.concat(id));
};

const openConfirmDelete = (id: string) => {
  modal.value.delete.selectedId = id;
  modal.value.delete.open = true;
};

const cancelDelete = () => {
  modal.value.delete.selectedId = '';
  modal.value.delete.open = false;
};

onMounted(async () => {
  loader.open();
  await Promise.all([fetchProduct(), fetchCategories()]);
  loader.close();
});
</script>
