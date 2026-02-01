<script setup>
import { onMounted, ref, computed } from 'vue'
import { paymentsApi } from '@/api/payments'
import OrderModal from '@/components/OrderModal.vue'
import { ordersApi } from '@/api/orders.js'

const payments = ref([])
const loading = ref(false)
const error = ref(null)

const selectedOrderId = ref(null)

const totalAmount = computed(() =>
  payments.value.filter((p) => p.status === 'SUCCESS').reduce((sum, p) => sum + p.paymentAmount, 0),
)

const fetchPayments = async () => {
  try {
    loading.value = true
    const { data } = await paymentsApi.getMyPayments()
    payments.value = data
  } catch {
    error.value = 'Ошибка загрузки платежей'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPayments)
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Оплаченные заказы</h1>

    <p v-if="error" class="text-red-600">{{ error }}</p>
    <p v-if="loading">Загрузка...</p>

    <table v-if="payments.length" class="w-full border rounded-xl overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">Заказ</th>
          <th class="p-3 text-left">Дата</th>
          <th class="p-3 text-left">Статус</th>
          <th class="p-3 text-right">Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in payments" :key="p.id" class="border-t hover:bg-gray-50">
          <td class="p-3">
            <button class="text-blue-600 underline" @click="selectedOrderId = p.orderId">
              #{{ p.orderId }}
            </button>
          </td>

          <td class="p-3">
            {{ new Date(p.timestamp).toLocaleString() }}
          </td>

          <td class="p-3">
            <span
              :class="{
                'text-green-600': p.status === 'SUCCESS',
                'text-red-600': p.status === 'FAILED',
              }"
              class="font-semibold"
            >
              {{ p.status }}
            </span>
          </td>

          <td class="p-3 text-right font-bold">{{ p.paymentAmount }} ₽</td>
        </tr>
      </tbody>
    </table>

    <div v-if="payments.length" class="mt-6 text-right text-xl font-bold">
      Итого оплачено: {{ totalAmount }} ₽
    </div>

    <OrderModal
      v-if="selectedOrderId"
      :order-id="selectedOrderId"
      @close="selectedOrderId = null"
    />
  </div>
</template>
