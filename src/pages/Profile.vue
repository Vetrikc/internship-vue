<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@/api/axios'
import { useRouter } from 'vue-router'
import { useAuth } from '@/store/auth.js'

const router = useRouter()
const auth = useAuth()

const loading = ref(false)
const success = ref(false)
const cardLoading = ref(false)
const cardSuccess = ref(false)

const profile = reactive({
  name: '',
  surname: '',
  birthDate: '',
  email: '',
})

const newCard = reactive({
  number: '',
  holder: '',
  expirationDate: '',
})

const cards = ref([])

// ------------------ USER ------------------
const fetchUser = async () => {
  try {
    const { data } = await api.get('/users/me')
    return data
  } catch (error) {
    console.error('Ошибка запроса профиля:', error.response?.data || error.message)
  }
}

const updateUser = async (payload) => {
  try {
    const { data } = await api.put('/users', payload)
    return data
  } catch (error) {
    console.error('Ошибка обновления профиля:', error.response?.data || error.message)
    throw error
  }
}

const saveProfile = async () => {
  try {
    loading.value = true
    await updateUser({
      name: profile.name,
      surname: profile.surname,
      birthDate: profile.birthDate,
    })
    success.value = true
    setTimeout(() => (success.value = false), 2000)
  } catch (e) {
    console.error('Ошибка сохранения профиля:', e)
  } finally {
    loading.value = false
  }
}

// ------------------ CARDS ------------------
const fetchCards = async () => {
  try {
    const { data } = await api.get('/cards')
    cards.value = data
  } catch (error) {
    console.error('Ошибка получения карт:', error.response?.data || error.message)
  }
}

const addCard = async () => {
  try {
    cardLoading.value = true
    await api.post('/cards', { ...newCard })
    cardSuccess.value = true
    newCard.number = ''
    newCard.holder = ''
    newCard.expirationDate = ''
    await fetchCards()
    setTimeout(() => (cardSuccess.value = false), 2000)
  } catch (error) {
    console.error('Ошибка добавления карты:', error.response?.data || error.message)
  } finally {
    cardLoading.value = false
  }
}

const updateCard = async (id, payload) => {
  try {
    await api.put(`/cards/${id}`, payload)
    await fetchCards()
  } catch (error) {
    console.error('Ошибка обновления карты:', error.response?.data || error.message)
  }
}

const deleteCard = async (id) => {
  try {
    await api.delete(`/cards/${id}`)
    await fetchCards()
  } catch (error) {
    console.error('Ошибка удаления карты:', error.response?.data || error.message)
  }
}

// ------------------ LOGOUT ------------------
const logout = () => {
  auth.logout()
  router.push('/login')
}

// ------------------ ON MOUNT ------------------
onMounted(async () => {
  const data = await fetchUser()
  if (data) {
    profile.name = data.name
    profile.surname = data.surname
    profile.birthDate = data.birthDate
    profile.email = data.email
  }
  await fetchCards()
})
</script>

<template>
  <div class="max-w-xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold mb-6">Профиль</h1>

    <!-- Профиль -->
    <div class="space-y-4">
      <input v-model="profile.name" class="input" placeholder="Имя" />
      <input v-model="profile.surname" class="input" placeholder="Фамилия" />
      <input v-model="profile.birthDate" type="date" class="input" />
      <input v-model="profile.email" disabled class="input bg-gray-100 cursor-not-allowed" />

      <button
        @click="saveProfile"
        :disabled="loading"
        class="w-full bg-black text-white py-3 rounded-xl hover:opacity-90"
      >
        {{ loading ? 'Сохранение...' : 'Сохранить' }}
      </button>
      <p v-if="success" class="text-green-600 text-center">Профиль обновлён ✅</p>

      <button
        @click="logout"
        class="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
      >
        Выйти из аккаунта
      </button>
    </div>

    <!-- Платежные карты -->
    <div class="space-y-4">
      <h2 class="text-2xl font-bold mt-8">Платежные карты</h2>

      <!-- Список карт -->
      <div
        v-for="card in cards"
        :key="card.id"
        class="flex items-center justify-between p-4 border rounded-xl"
      >
        <div>
          <p class="font-medium">{{ card.holder }}</p>
          <p class="text-gray-500">{{ card.number }} - {{ card.expirationDate }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="updateCard(card.id, card)" class="text-blue-600 hover:underline">
            Редактировать
          </button>
          <button @click="deleteCard(card.id)" class="text-red-600 hover:underline">Удалить</button>
        </div>
      </div>

      <!-- Добавление новой карты -->
      <div class="space-y-2 mt-4">
        <input v-model="newCard.number" placeholder="Номер карты" class="input" />
        <input v-model="newCard.holder" placeholder="Имя держателя" class="input" />
        <input v-model="newCard.expirationDate" type="date" class="input" />

        <button
          @click="addCard"
          :disabled="cardLoading"
          class="w-full bg-black text-white py-3 rounded-xl hover:opacity-90"
        >
          {{ cardLoading ? 'Сохранение...' : 'Добавить карту' }}
        </button>
        <p v-if="cardSuccess" class="text-green-600 text-center">Карта добавлена ✅</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
}
.input:focus {
  border-color: #9ca3af;
}
</style>
