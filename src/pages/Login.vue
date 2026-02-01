<script setup>
import { ref } from 'vue'
import { useAuth } from '@/store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuth()
const router = useRouter()

const submit = async () => {
  await auth.login(email.value, password.value)
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white w-96 rounded-xl shadow-xl p-8">
      <h2 class="text-2xl font-bold mb-2">Вход</h2>
      <p class="text-gray-400 mb-6">Войдите в свой аккаунт</p>

      <div class="flex flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="border border-gray-200 rounded-md py-2 px-4 outline-none focus:border-gray-400"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Пароль"
          class="border border-gray-200 rounded-md py-2 px-4 outline-none focus:border-gray-400"
        />

        <button
          @click="submit"
          class="mt-2 bg-lime-500 text-white rounded-md py-3 hover:bg-lime-600 transition"
        >
          Войти
        </button>
      </div>

      <p class="text-center text-sm text-gray-400 mt-6">
        Нет аккаунта?
        <router-link to="/register" class="text-lime-500 hover:underline">
          Зарегистрироваться
        </router-link>
      </p>
    </div>
  </div>
</template>
