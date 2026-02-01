<script setup>
import { ref, watch, provide, computed } from 'vue'
import Header from '@/components/Header.vue'
import Drawer from '@/components/Drawer.vue'

const cartItems = ref([])

const totalPrice = computed(() => cartItems.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round(totalPrice.value * 0.05))

const drawerOpen = ref(false)

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const addToCart = (item) => {
  cartItems.value.push({ ...item })
}

const removeFromCart = (item) => {
  cartItems.value = cartItems.value.filter((cartItem) => cartItem.id !== item.id)
}

watch(
  cartItems,
  () => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
  },
  {
    deep: true,
  },
)

provide('cart', {
  cartItems,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
})
</script>

<template>
  <router-view />
</template>
