<script setup>
import { computed, inject, ref } from 'vue'
import DrawerHead from '@/components/DrawerHead.vue'
import InfoBlock from '@/components/infoBlock.vue'
import CartListItem from '@/components/CartListItem.vue'
import api from '@/api/axios'
import { paymentsApi } from '@/api/payments'

// -------------------- PROPS --------------------
defineProps({
  totalPrice: Number,
})

// -------------------- STORES --------------------
const { cartItems } = inject('cart')

// -------------------- STATE --------------------
const isCreatingOrder = ref(false)
const isPaying = ref(false)

const orderId = ref(null)
const paymentSuccess = ref(false)
const paymentError = ref(null)

// -------------------- COMPUTED --------------------
const cartEmpty = computed(() => cartItems.value.length === 0)
const cartButtonDisabled = computed(() => isCreatingOrder.value || cartEmpty.value)

// -------------------- METHODS --------------------
const createOrder = async () => {
  try {
    isCreatingOrder.value = true

    const payload = {
      status: 'CREATED',
      orderItems: cartItems.value.map((item) => ({
        itemId: item.id,
        quantity: 1,
      })),
    }

    const { data } = await api.post('/orders', payload)
    orderId.value = data.order.id
  } catch (e) {
    console.error('Ошибка создания заказа:', e.response?.data || e.message)
  } finally {
    isCreatingOrder.value = false
  }
}

const payOrder = async () => {
  try {
    if (!orderId.value) {
      throw new Error('ORDER_NOT_FOUND')
    }

    isPaying.value = true
    paymentError.value = null

    const response = await paymentsApi.pay(orderId.value)
    console.log(response.data.status)
    if (response.data.status === 'FAILED') {
      paymentError.value = 'Оплата не прошла. Пожалуйста, оплатите еще раз.'
    } else {
      paymentSuccess.value = true
      cartItems.value = []
    }
  } catch (e) {
    paymentError.value = e.response?.data?.message || 'Ошибка оплаты'
  } finally {
    isPaying.value = false
  }
}
</script>

<template>
  <!-- затемнение -->
  <div class="fixed top-0 left-0 h-full w-full bg-black opacity-70 z-10"></div>

  <!-- drawer -->
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8 flex flex-col">
    <DrawerHead />

    <!-- ================= ПУСТАЯ КОРЗИНА ================= -->
    <div v-if="!totalPrice && !orderId" class="flex flex-1 items-center">
      <InfoBlock
        title="Корзина пустая"
        description="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />
    </div>

    <!-- ================= ОСНОВНОЙ КОНТЕНТ ================= -->
    <div v-else class="flex flex-col flex-1 justify-between">
      <!-- список товаров -->
      <CartListItem v-if="!paymentSuccess" />

      <!-- итоги -->
      <div v-if="!paymentSuccess" class="flex flex-col gap-4 mt-6">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} ₽</b>
        </div>

        <!-- СОЗДАНИЕ ЗАКАЗА -->
        <button
          v-if="!orderId"
          :disabled="cartButtonDisabled"
          @click="createOrder"
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-300"
        >
          {{ isCreatingOrder ? 'Создание...' : 'Оформить заказ' }}
        </button>

        <!-- ОПЛАТА -->
        <button
          v-else
          :disabled="isPaying"
          @click="payOrder"
          class="mt-4 bg-blue-600 w-full rounded-xl py-3 text-white hover:bg-blue-700 disabled:bg-slate-300"
        >
          {{ isPaying ? 'Оплата...' : 'Оплатить картой' }}
        </button>

        <p v-if="paymentError" class="text-red-600 text-center mt-2">
          {{ paymentError }}
        </p>
      </div>

      <!-- ================= УСПЕШНАЯ ОПЛАТА ================= -->
      <div v-if="paymentSuccess" class="flex flex-1 items-center">
        <InfoBlock
          title="Оплата прошла успешно 🎉"
          :description="`Заказ #${orderId} успешно оплачен`"
          image-url="/order-success-icon.png"
        />
      </div>
    </div>
  </div>
</template>
