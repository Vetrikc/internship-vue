<script setup>
import { ref } from 'vue'
import { useAuth } from '@/store/auth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  name: '',
  surname: '',
  birthDate: '',
})

const submit = async () => {
  await auth.register(form.value)
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white w-[420px] rounded-xl shadow-xl p-8">
      <h2 class="text-2xl font-bold mb-2">Регистрация</h2>
      <p class="text-gray-400 mb-6">Создайте новый аккаунт</p>

      <div class="flex flex-col gap-4">
        <input v-model="form.email" type="email" placeholder="Email" class="input" />

        <input v-model="form.password" type="password" placeholder="Пароль" class="input" />

        <div class="flex gap-3">
          <input v-model="form.name" placeholder="Имя" class="input flex-1" />
          <input v-model="form.surname" placeholder="Фамилия" class="input flex-1" />
        </div>

        <input v-model="form.birthDate" type="date" class="input" />

        <button
          @click="submit"
          class="mt-2 bg-lime-500 text-white rounded-md py-3 hover:bg-lime-600 transition"
        >
          Зарегистрироваться
        </button>
      </div>

      <p class="text-center text-sm text-gray-400 mt-6">
        Уже есть аккаунт?
        <router-link to="/login" class="text-lime-500 hover:underline"> Войти </router-link>
      </p>
    </div>
  </div>
</template>
