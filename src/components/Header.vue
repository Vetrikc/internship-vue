<script setup>
const emit = defineEmits(['openDrawer'])

defineProps({
  totalPrice: Number,
})
</script>
<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-10" />
        <div>
          <h2 class="text-xl font-bold uppercase">Vue Sneakers</h2>
          <p class="text-slate-400">Магазин кроссовок</p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li
        @click="() => emit('openDrawer')"
        class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="Card" />
        <b>{{ totalPrice }} руб.</b>
      </li>
      <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
        <img src="/heart.svg" alt="Heart" />
        <span>Закладки</span>
      </li>
      <li>
        <router-link
          to="/payments"
          class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
        >
          <img src="/cart.svg" alt="Card" />
          <span>Заказы</span>
        </router-link>
      </li>

      <li>
        <router-link
          to="/profile"
          class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
        >
          <img src="/profile.svg" alt="Profile" />
          <span>Профиль</span>
        </router-link>
      </li>

    </ul>
  </header>
</template>
