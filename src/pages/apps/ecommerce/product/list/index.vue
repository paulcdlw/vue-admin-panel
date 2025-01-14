<script setup>
import { getProducts } from '@/utils/api'
const headers = [
  {
    title: 'Product',
    key: 'name',
  },
  {
    title: 'Short Description',
    key: 'shortDescription',
  },
  {
    title: 'Category',
    key: 'categoria',
  },
  {
    title: 'Quantity',
    key: 'quantity',
  },
]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref()
const searchQuery = ref('')
const selectedRows = ref([])
const productsData = ref([])
const categories = ref([])

const status = ref([
  {
    title: 'Scheduled',
    value: 'Scheduled',
  },
  {
    title: 'Publish',
    value: 'Published',
  },
  {
    title: 'Inactive',
    value: 'Inactive',
  },
]);

const stockStatus = ref([
  {
    title: 'In Stock',
    value: true,
  },
  {
    title: 'Out of Stock',
    value: false,
  },
])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = options => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const resolveStatus = statusMsg => {
  if (statusMsg === 'Scheduled')
    return {
      text: 'Scheduled',
      color: 'warning',
    }
  if (statusMsg === 'Published')
    return {
      text: 'Publish',
      color: 'success',
    }
  if (statusMsg === 'Inactive')
    return {
      text: 'Inactive',
      color: 'error',
    }

}

const fetchProducts = async () => {
  try {
    // Llama a getProducts con los parámetros requeridos
    const response = await getProducts({
      q: searchQuery.value,
      stock: selectedStock.value,
      category: selectedCategory.value,
      status: selectedStatus.value,
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      orderBy: orderBy.value,
    })
    // Verifica y asigna la respuesta
    productsData.value = response
    console.log('Fetching with filters:', {
      q: searchQuery.value,
      stock: selectedStock.value,
      category: selectedCategory.value,
      status: selectedStatus.value,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.map(category => ({
      title: category.name,
      value: category.id,
    }))
    console.log(categories.value)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const getCategoryName = (categoryIds) => {
  if (typeof categoryIds === 'string') {
    try {
      categoryIds = JSON.parse(categoryIds)
    } catch (e) {
      console.error('Error parsing categoryIds:', e)
      return 'Unknown'
    }
  }
  return categoryIds.map(id => {
    const category = categories.value.find(cat => cat.value === id)
    return category ? category.title : 'Unknown'
  }).join(', ')
}

const totalProduct = computed(() => productsData.value.length)

const deleteProduct = async id => {
  await $api(`apps/ecommerce/products/${id}`, { method: 'DELETE' })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)


}

const truncateDescription = (description) => {
  if (description.length > 50) {
    return description.substring(0, 50) + '...'
  }
  return description
}

watch([selectedStatus, selectedCategory, selectedStock, searchQuery], () => {
  console.log('Filters changed:', {
    selectedStatus: selectedStatus.value,
    selectedCategory: selectedCategory.value,
    selectedStock: selectedStock.value,
    searchQuery: searchQuery.value,
  })
  fetchProducts()
})

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<template>
  <div>
    <!-- 👉 products -->
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Filters</VCardTitle>
      </VCardItem>
      <VCardText>
        <VRow>
          <!-- 👉 Select Status -->
          <VCol cols="12" sm="4">
            <VSelect v-model="selectedStatus" label="Select Status" placeholder="Select Status" :items="status"
              clearable clear-icon="ri-close-line" />
          </VCol>

          <!-- 👉 Select Category -->
          <VCol cols="12" sm="4">
            <VSelect v-model="selectedCategory" label="Category" placeholder="Select Category" :items="categories"
              clearable clear-icon="ri-close-line" />
          </VCol>

          <!-- 👉 Select Stock Status -->
          <VCol cols="12" sm="4">
            <VSelect v-model="selectedStock" label="Stock" placeholder="Stock" :items="stockStatus" clearable
              clear-icon="ri-close-line" />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <VTextField v-model="searchQuery" placeholder="Search Product" style="inline-size: 200px;" density="compact"
            class="me-3" />
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4 align-center">
          <!-- 👉 Export button -->
          <VBtn variant="outlined" color="secondary" prepend-icon="ri-upload-2-line">
            Export
          </VBtn>

          <VBtn color="primary" prepend-icon="ri-add-line" @click="$router.push('/apps/ecommerce/product/add')">
            Add Product
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer v-model:model-value="selectedRows" v-model:items-per-page="itemsPerPage" v-model:page="page"
        :headers="headers" show-select :items="productsData" :items-length="totalProduct" class="text-no-wrap rounded-0"
        @update:options="updateOptions">
        <!-- product  -->
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-3">
            <VAvatar v-if="item.image" size="38" variant="tonal" rounded :image="item.image" />
            <div class="d-flex flex-column">
              <span class="text-base text-high-emphasis font-weight-medium">{{ item.name }}</span>
              <span class="text-sm text-medium-emphasis">{{ item.price }}</span>
            </div>
          </div>
        </template>

        <!-- short description -->
        <template #item.shortDescription="{ item }">
          <span class="text-base text-high-emphasis" v-html="truncateDescription(item.short_description)"></span>
        </template>

        <!-- category -->
        <template #item.categoria="{ item }">
          <span class="text-base text-high-emphasis">{{ getCategoryName(item.categoria) }}</span>
        </template>

        <!-- quantity -->
        <template #item.quantity="{ item }">
          <span class="text-base text-high-emphasis">{{ item.quantity }}</span>
        </template>

        <!-- status -->
        <template #item.status="{ item }">
          <VChip v-bind="resolveStatus(item.status)" size="small" />
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-edit-box-line" />
          </IconBtn>

          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem value="download" prepend-icon="ri-download-line">
                  Download
                </VListItem>

                <VListItem value="delete" prepend-icon="ri-delete-bin-line" @click="deleteProduct(item.id)">
                  Delete
                </VListItem>

                <VListItem value="duplicate" prepend-icon="ri-stack-line">
                  Duplicate
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />

          <div class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1">
            <div class="d-flex align-center gap-x-2 text-medium-emphasis text-base">
              Rows Per Page:
              <VSelect v-model="itemsPerPage" class="per-page-select" variant="plain" :items="[10, 20, 25, 50, 100]" />
            </div>

            <p class="d-flex align-center text-base text-high-emphasis me-2 mb-0">
              {{ paginationMeta({ page, itemsPerPage }, totalProduct) }}
            </p>

            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn class="flip-in-rtl" icon="ri-arrow-left-s-line" variant="text" density="comfortable"
                color="high-emphasis" :disabled="page <= 1" @click="page <= 1 ? page = 1 : page--" />

              <VBtn class="flip-in-rtl" icon="ri-arrow-right-s-line" density="comfortable" variant="text"
                color="high-emphasis" :disabled="page >= Math.ceil(totalProduct / itemsPerPage)"
                @click="page >= Math.ceil(totalProduct / itemsPerPage) ? page = Math.ceil(totalProduct / itemsPerPage) : page++" />
            </div>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

  </div>
</template>
