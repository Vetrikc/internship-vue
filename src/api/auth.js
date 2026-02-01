import api from './axios'

export const authApi = {
  login(data) {
    return api.post('/auth/login', data)
  },

  register(data) {
    return api.post('/auth/register', data)
  },

  refresh(refreshToken) {
    return api.post('/auth/refresh', { refreshToken })
  },

  validate(token) {
    return api.post('/auth/validate', { token })
  },
}
