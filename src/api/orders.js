import api from './axios'

export const ordersApi = {
  getOrderById(orderId) {
    return api.get(`/orders/${orderId}`)
  },
}
