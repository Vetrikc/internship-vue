<script setup>
import CardList from '@/components/CardList.vue'
import api from '../api/axios'

import { inject, onMounted, reactive, ref, watch } from 'vue'

const items = ref([])
const { addToCart, removeFromCart, cartItems } = inject('cart')

const filters = reactive({
  sortBy: 'id',
  searchQuery: '',
})

const page = ref(0)
const size = 10
const isLoading = ref(false)
const hasMore = ref(true)

const bottomRef = ref(null)




const isItemAdded = (itemId) => cartItems.value.some((cartItem) => cartItem.id === itemId)

const onSortChange = (event) => {
  filters.sortBy = event.target.value
}

const onSearchInput = (event) => {
  filters.searchQuery = event.target.value
}



const onClickAddCart = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
  console.log(cartItems)
}
const fakeImageUrl = () => {
  const min = 1
  const max = 12 // количество картинок
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  return `/sneakers/sneakers-${randomNumber}.jpg`
}
const fetchItems = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true

  try {
    const { data } = await api.get('/items', {
      params: {
        page: page.value,
        size,
        sort: filters.sortBy,
        name: filters.searchQuery,
      },
    })

    const newItems = data.content.map(item => ({
      ...item,
      imageUrl: fakeImageUrl(),
      isAdded: isItemAdded(item.id),
    }))

    items.value.push(...newItems)

    hasMore.value = !data.last
    page.value++
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}


const createObserver = () => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fetchItems()
      }
    },
    { threshold: 1 }
  )

  if (bottomRef.value) {
    observer.observe(bottomRef.value)
  }
}


watch(
  filters,
  () => {
    items.value = []
    page.value = 0
    hasMore.value = true
    fetchItems()
  },
  { deep: true }
)


onMounted(() => {
  const localCart = localStorage.getItem('cartItems')
  cartItems.value = localCart ? JSON.parse(localCart) : []

  fetchItems()
  createObserver()
})



</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>

    <div class="flex gap-4">

      <select @change="onSortChange"
      class="py-2 px-3 border border-gray-200 rounded-md outline-none"
      >
        <option value="price,asc">По цене (сначала дешёвые)</option>
        <option value="price,desc">По цене (сначала дорогие)</option>
        <option value="name,asc">По названию</option>
      </select>

      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" alt="Search" />
        <input @input="onSearchInput"
               class="border border-gray-200 rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
               type="text"
               placeholder="Поиск..."
        />
      </div>
    </div>
  </div>
  <div class="mt-10">
    <CardList
      :items="
        items.map((item) => ({
          ...item,
          isAdded: isItemAdded(item.id),
        }))
      "
      @add-to-cart="onClickAddCart"
    />
  </div>
  <div ref="bottomRef" class="h-10"></div>

  <div v-if="isLoading" class="text-center mt-6 text-gray-400">
    Загрузка...
  </div>

  <div v-if="!hasMore" class="text-center mt-6 text-gray-400">
    Больше товаров нет
  </div>
</template>
