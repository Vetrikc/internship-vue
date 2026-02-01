import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

const accessToken = ref(localStorage.getItem('accessToken'))
const refreshToken = ref(localStorage.getItem('refreshToken'))

const isAuth = computed(() => !!accessToken.value)

const saveTokens = (tokens) => {
  if (!tokens.accessToken || !tokens.refreshToken) {
    console.error('saveTokens: нет access или refresh токена', tokens)
    return
  }

  accessToken.value = tokens.accessToken
  refreshToken.value = tokens.refreshToken

  localStorage.setItem('accessToken', tokens.accessToken)
  localStorage.setItem('refreshToken', tokens.refreshToken)
}


const clearTokens = () => {
  accessToken.value = null
  refreshToken.value = null

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

const login = async (email, password) => {
  const { data } = await authApi.login({ email, password })

  if (!data.accessToken || !data.refreshToken) {
    throw new Error('Сервер не вернул refreshToken')
  }

  saveTokens(data)
}


const register = async (payload) => {
  await authApi.register(payload)
}

const logout = () => {
  clearTokens()
}

const validate = async () => {
  if (!accessToken.value) return false

  try {
    await authApi.validate(accessToken.value)
    return true
  } catch {
    return false
  }
}

const refresh = async () => {
  if (!refreshToken.value) throw new Error('No refresh token')

  const { data } = await authApi.refresh(refreshToken.value)
  saveTokens(data)
}

export const useAuth = () => ({
  accessToken,
  refreshToken,
  isAuth,
  login,
  register,
  logout,
  validate,
  refresh,
})
