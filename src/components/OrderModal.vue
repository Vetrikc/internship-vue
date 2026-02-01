<script setup>
import { onMounted, ref } from 'vue'
import { ordersApi } from '@/api/orders'

const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['close'])

const order = ref(null)
const user = ref(null)
const loading = ref(false)
const error = ref(null)

const fakeImageUrl = () => {
  const min = 1
  const max = 12 // количество картинок
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  return `/sneakers/sneakers-${randomNumber}.jpg`
}

onMounted(async () => {
  try {
    loading.value = true
    const { data } = await ordersApi.getOrderById(props.orderId)
    order.value = data.order
    user.value = data.user

    for (const item of data.order.orderItems) {
      item.imageUrl = fakeImageUrl()
    }
  } catch {
    error.value = 'Ошибка загрузки заказа'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black/60 z-40" @click.self="emit('close')">
    <div class="bg-white w-[650px] max-h-[80vh] overflow-y-auto rounded-xl p-6 mx-auto mt-20">
      <h2 class="text-2xl font-bold mb-4">Заказ #{{ orderId }}</h2>

      <p v-if="loading">Загрузка...</p>
      <p v-if="error" class="text-red-600">{{ error }}</p>

      <template v-if="order">
        <!-- Информация о заказе -->
        <div class="mb-4 text-sm space-y-1">
          <p><b>Статус:</b> {{ order.status }}</p>
          <p><b>Дата:</b> {{ new Date(order.createdAt).toLocaleString() }}</p>
          <p><b>Сумма:</b> {{ order.totalPrice }} ₽</p>
        </div>

        <!-- Пользователь -->
        <div class="mb-4 text-sm space-y-1">
          <p><b>Покупатель:</b> {{ user.name }} {{ user.surname }}</p>
          <p><b>Email:</b> {{ user.email }}</p>
        </div>

        <!-- Items -->
        <div class="space-y-3">
          <div
            v-for="oi in order.orderItems"
            :key="oi.id"
            class="flex items-center gap-4 border rounded-lg p-3"
          >
            <!-- КАРТИНКА -->
            <img
              :src="oi.imageUrl"
              alt="item image"
              class="w-20 h-20 object-cover rounded-lg border"
            />

            <div class="flex-1">
              <p class="font-medium">{{ oi.item.name }}</p>
              <p class="text-sm text-gray-500">{{ oi.quantity }} × {{ oi.item.price }} ₽</p>
            </div>

            <b>{{ oi.quantity * oi.item.price }} ₽</b>
          </div>
        </div>
      </template>

      <button class="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg" @click="emit('close')">
        Закрыть
      </button>
    </div>
  </div>
</template>
