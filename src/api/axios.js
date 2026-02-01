import axios from 'axios'
import { useAuth } from '@/store/auth'
import { authApi } from './auth'

const { accessToken, refreshToken, logout } = useAuth()

const api = axios.create({
  baseURL: '/api/v1',
})

api.interceptors.request.use((config) => {
  const url = config.url || ''

  if (
    !url.includes('/auth/login') &&
    !url.includes('/auth/refresh') &&
    !url.includes('/auth/register')
  ) {
    if (accessToken.value) {
      config.headers.Authorization = `Bearer ${accessToken.value}`
    }
  }

  return config
})

// перехват 401 и авто-refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config

    if (error.response?.status === 401 && !config._retry) {
      config._retry = true

      if (!refreshToken.value) {
        logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        if (accessToken.value && accessToken.value !== 'undefined') {
          config.headers.Authorization = `Bearer ${accessToken.value}`
        }

        if (refreshToken.value && refreshToken.value === 'undefined') {
          console.warn('refreshToken = undefined! Выход из аккаунта')
          logout()
        }
        const { data } = await authApi.refresh(refreshToken.value)
        accessToken.value = data.accessToken
        refreshToken.value = data.refreshToken

        config.headers.Authorization = `Bearer ${accessToken.value}`
        return api.request(config)
      } catch (e) {
        logout()
        window.location.href = '/login'
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  },
)

export default api
