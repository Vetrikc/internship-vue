<script setup>
import { inject } from 'vue'

import CartItem from '@/components/CartItem.vue'

const { cartItems, removeFromCart } = inject('cart')
</script>
<template>
  <div class="flex flex-col flax-1 gap-4 justify-between">
    <CartItem
      v-for="item in cartItems"
      :key="item.id"
      :item="item"
      :title="item.name"
      :price="item.price"
      :image-url="item.imageUrl"
      @on-click-remove="() => removeFromCart(item)"
    />
  </div>
</template>
