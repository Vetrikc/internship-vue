<script setup>
import Card from './Card.vue'

defineProps({
  items: Array,
})

const emit = defineEmits(['addToCart'])


</script>
<template>
  <div class="grid grid-cols-4 gap-5">
    <Card
      v-for="item in items"
      :key="item.id"
      :title="item.name"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :onClickAdd="() => emit('addToCart', item)"
      :isAdded="item.isAdded"
    />
  </div>
</template>
