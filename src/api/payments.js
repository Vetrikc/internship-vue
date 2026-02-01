import api from './axios'

export const paymentsApi = {
  getMyPayments() {
    return api.get('/payments')
  },

  getTotalByPeriod(startDate, endDate) {
    return api.get('/payments/total/user/me', {
      params: { startDate, endDate },
    })
  },

  pay(orderId) {
    return api.post('/payments', { orderId })
  },
}
