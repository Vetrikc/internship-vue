<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@/api/axios'
import OrderModal from '@/components/OrderModal.vue'

// -------------------- USERS --------------------
const users = ref([])
const fetchUsers = async () => {
  try {
    const { data } = await api.get('/admin/user', {
      params: { page: 0, size: 20, sort: ['id,asc'] },
    })
    users.value = data.content || []
  } catch (e) {
    console.error(e)
  }
}

const deactivateUser = async (id) => {
  await api.put(`/admin/user/${id}/deactivate`)
  fetchUsers()
}

const activateUser = async (id) => {
  await api.put(`/admin/user/${id}/activate`)
  fetchUsers()
}

const makeAdmin = async (id) => {
  await api.put(`/admin/user/${id}/admin`)
  fetchUsers()
}

const fetchUser = async (id) => {
  try {
    const { data } = await api.get(`/admin/user/${id}`)
    console.log(data) // For demonstration
  } catch (e) {
    console.error(e)
  }
}

// -------------------- CARDS --------------------
const cards = ref([])
const fetchCards = async () => {
  try {
    const { data } = await api.get('/admin/cards', {
      params: { page: 0, size: 20, sort: ['id,asc'] },
    })
    cards.value = data.content || []
  } catch (e) {
    console.error(e)
  }
}

const userIdForCards = ref('')
const userCards = ref([])
const fetchUserCards = async () => {
  try {
    const { data } = await api.get(`/admin/cards/users/${userIdForCards.value}`)
    userCards.value = data || []
  } catch (e) {
    console.error(e)
  }
}

const activateCard = async (id) => {
  await api.put(`/admin/cards/${id}/activate`)
  fetchCards()
  if (userIdForCards.value) fetchUserCards()
}

const deactivateCard = async (id) => {
  await api.put(`/admin/cards/${id}/deactivate`)
  fetchCards()
  if (userIdForCards.value) fetchUserCards()
}

const updateCard = async (card) => {
  await api.put(`/admin/cards/${card.id}`, card)
  fetchCards()
  if (userIdForCards.value) fetchUserCards()
}

const fetchCard = async (id) => {
  try {
    const { data } = await api.get(`/admin/cards/${id}`)
    console.log(data) // For demonstration
  } catch (e) {
    console.error(e)
  }
}

// -------------------- ORDERS --------------------
const orders = ref([])
const fetchOrders = async () => {
  try {
    const { data } = await api.get('/admin/orders', {
      params: { page: 0, size: 20, sort: ['id,asc'] },
    })
    orders.value = data.content || []
  } catch (e) {
    console.error(e)
  }
}

const newOrder = reactive({
  userId: 0,
  status: '',
  orderItems: [{ itemId: 0, quantity: 1 }],
})

const createOrder = async () => {
  await api.post('/admin/orders', newOrder)
  fetchOrders()
}

const updateOrder = async (order) => {
  await api.put(`/admin/orders/${order.id}`, order)
  fetchOrders()
}

const deleteOrder = async (id) => {
  await api.delete(`/admin/orders/${id}`)
  fetchOrders()
}

const selectedOrderId = ref(null)

const fetchOrder = async (id) => {
  try {
    const { data } = await api.get(`/admin/orders/${id}`)
    console.log(data) // For demonstration
  } catch (e) {
    console.error(e)
  }
}

// -------------------- ITEMS --------------------
const items = ref([])
const fetchItems = async () => {
  try {
    const { data } = await api.get('/admin/items', {
      params: { page: 0, size: 20, sort: ['id,asc'] },
    })
    items.value = data.content || []
  } catch (e) {
    console.error(e)
  }
}

const newItem = reactive({
  name: '',
  price: 0,
})

const createItem = async () => {
  await api.post('/admin/items', newItem)
  fetchItems()
}

const updateItem = async (item) => {
  await api.put(`/admin/items/${item.id}`, item)
  fetchItems()
}

const deleteItem = async (id) => {
  await api.delete(`/admin/items/${id}`)
  fetchItems()
}

const fetchItem = async (id) => {
  try {
    const { data } = await api.get(`/admin/items/${id}`)
    console.log(data) // For demonstration
  } catch (e) {
    console.error(e)
  }
}

// -------------------- PAYMENTS --------------------
const payments = ref([])
const paymentFilters = reactive({
  userId: null,
  orderId: null,
  status: null,
})

const fetchPayments = async () => {
  const params = {}
  if (paymentFilters.userId) params.userId = paymentFilters.userId
  if (paymentFilters.orderId) params.orderId = paymentFilters.orderId
  if (paymentFilters.status) params.status = paymentFilters.status
  try {
    const { data } = await api.get('/admin/payments', { params })
    payments.value = data || []
  } catch (e) {
    console.error(e)
  }
}

const total = ref(0)
const totalFilters = reactive({
  startDate: '',
  endDate: '',
})

const fetchTotal = async () => {
  const params = {}
  if (totalFilters.startDate) params.startDate = totalFilters.startDate
  if (totalFilters.endDate) params.endDate = totalFilters.endDate
  try {
    const { data } = await api.get('/admin/payments/total/all', { params })
    total.value = data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchUsers()
  fetchCards()
  fetchOrders()
  fetchItems()
  fetchPayments()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-8">Admin Panel</h1>

    <!-- USERS -->
    <section class="mb-12">
      <h2 class="text-2xl mb-4">Users</h2>
      <table class="w-full border-collapse border">
        <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Surname</th>
          <th class="border p-2">Email</th>
          <th class="border p-2">Active</th>
          <th class="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in users" :key="u.id">
          <td class="border p-2">{{ u.id }}</td>
          <td class="border p-2">{{ u.name }}</td>
          <td class="border p-2">{{ u.surname }}</td>
          <td class="border p-2">{{ u.email }}</td>
          <td class="border p-2">{{ u.active }}</td>
          <td class="border p-2">
            <button @click="activateUser(u.id)" class="mr-2">Activate</button>
            <button @click="deactivateUser(u.id)" class="mr-2">Deactivate</button>
            <button @click="makeAdmin(u.id)" class="mr-2">Make Admin</button>
            <button @click="fetchUser(u.id)">View</button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- CARDS -->
    <section class="mb-12">
      <h2 class="text-2xl mb-4">Cards</h2>
      <table class="w-full border-collapse border">
        <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Number</th>
          <th class="border p-2">Holder</th>
          <th class="border p-2">Expiration</th>
          <th class="border p-2">Active</th>
          <th class="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="c in cards" :key="c.id">
          <td class="border p-2">{{ c.id }}</td>
          <td class="border p-2"><input v-model="c.number" class="w-full" /></td>
          <td class="border p-2"><input v-model="c.holder" class="w-full" /></td>
          <td class="border p-2"><input v-model="c.expirationDate" type="date" class="w-full" /></td>
          <td class="border p-2">{{ c.active }}</td>
          <td class="border p-2">
            <button @click="updateCard(c)" class="mr-2">Update</button>
            <button @click="activateCard(c.id)" class="mr-2">Activate</button>
            <button @click="deactivateCard(c.id)" class="mr-2">Deactivate</button>
            <button @click="fetchCard(c.id)">View</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <input v-model="userIdForCards" placeholder="User ID for Cards" class="mr-2" />
        <button @click="fetchUserCards">Fetch User Cards</button>
      </div>
      <table v-if="userCards.length" class="w-full border-collapse border mt-4">
        <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Number</th>
          <th class="border p-2">Holder</th>
          <th class="border p-2">Expiration</th>
          <th class="border p-2">Active</th>
          <th class="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="c in userCards" :key="c.id">
          <td class="border p-2">{{ c.id }}</td>
          <td class="border p-2"><input v-model="c.number" class="w-full" /></td>
          <td class="border p-2"><input v-model="c.holder" class="w-full" /></td>
          <td class="border p-2"><input v-model="c.expirationDate" type="date" class="w-full" /></td>
          <td class="border p-2">{{ c.active }}</td>
          <td class="border p-2">
            <button @click="updateCard(c)" class="mr-2">Update</button>
            <button @click="activateCard(c.id)" class="mr-2">Activate</button>
            <button @click="deactivateCard(c.id)" class="mr-2">Deactivate</button>
            <button @click="fetchCard(c.id)">View</button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>

    <!-- ORDERS -->
    <section class="mb-12">
      <h2 class="text-2xl mb-4">Orders</h2>
      <table class="w-full border-collapse border">
        <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">User ID</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td class="border p-2">{{ o.id }}</td>
          <td class="border p-2">{{ o.userId }}</td>
          <td class="border p-2"><input v-model="o.status" class="w-full" /></td>
          <td class="border p-2">
            <button @click="updateOrder(o)" class="mr-2">Update</button>
            <button @click="deleteOrder(o.id)" class="mr-2">Delete</button>
            <button @click="selectedOrderId = o.id" class="mr-2">View Modal</button>
            <button @click="fetchOrder(o.id)">View</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <h3 class="text-xl mb-2">Create Order</h3>
        <input v-model="newOrder.userId" placeholder="User ID" class="mr-2" />
        <input v-model="newOrder.status" placeholder="Status" class="mr-2" />
        <input v-model="newOrder.orderItems[0].itemId" placeholder="Item ID" class="mr-2" />
        <input v-model="newOrder.orderItems[0].quantity" placeholder="Quantity" class="mr-2" />
        <button @click="createOrder">Create</button>
      </div>
    </section>

    <!-- ITEMS -->
    <section class="mb-12">
      <h2 class="text-2xl mb-4">Items</h2>
      <table class="w-full border-collapse border">
        <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Price</th>
          <th class="border p-2">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="i in items" :key="i.id">
          <td class="border p-2">{{ i.id }}</td>
          <td class="border p-2"><input v-model="i.name" class="w-full" /></td>
          <td class="border p-2"><input v-model="i.price" type="number" class="w-full" /></td>
          <td class="border p-2">
            <button @click="updateItem(i)" class="mr-2">Update</button>
            <button @click="deleteItem(i.id)" class="mr-2">Delete</button>
            <button @click="fetchItem(i.id)">View</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <h3 class="text-xl mb-2">Create Item</h3>
        <input v-model="newItem.name" placeholder="Name" class="mr-2" />
        <input v-model="newItem.price" type="number" placeholder="Price" class="mr-2" />
        <button @click="createItem">Create</button>
      </div>
    </section>

    <!-- PAYMENTS -->
    <section class="mb-12">
      <h2 class="text-2xl mb-4">Payments</h2>
      <div class="mb-4">
        <input v-model="paymentFilters.userId" placeholder="User ID" class="mr-2" />
        <input v-model="paymentFilters.orderId" placeholder="Order ID" class="mr-2" />
        <input v-model="paymentFilters.status" placeholder="Status" class="mr-2" />
        <button @click="fetchPayments">Fetch</button>
      </div>
      <table v-if="payments.length" class="w-full border-collapse border">
        <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Order ID</th>
          <th class="border p-2">Timestamp</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">Amount</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in payments" :key="p.id">
          <td class="border p-2">{{ p.id }}</td>
          <td class="border p-2">{{ p.orderId }}</td>
          <td class="border p-2">{{ p.timestamp }}</td>
          <td class="border p-2">{{ p.status }}</td>
          <td class="border p-2">{{ p.paymentAmount }}</td>
        </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <h3 class="text-xl mb-2">Total Payments</h3>
        <input v-model="totalFilters.startDate" type="date" class="mr-2" />
        <input v-model="totalFilters.endDate" type="date" class="mr-2" />
        <button @click="fetchTotal">Fetch Total</button>
        <p v-if="total">Total: {{ total }}</p>
      </div>
    </section>

    <OrderModal
      v-if="selectedOrderId"
      :order-id="selectedOrderId"
      @close="selectedOrderId = null"
    />
  </div>
</template>
