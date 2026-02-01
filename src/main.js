import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import App from '@/App.vue'
import { useAuth } from '@/store/auth'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Profile from '@/pages/Profile.vue'
import Payments from '@/pages/Payments.vue'
import Admin from '@/pages/Admin.vue'

const app = createApp(App)


const auth = useAuth()
auth.validate()

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { auth: true },
    children: [
      {
        path: '',
        component: Home,
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
    ],
  },
  {
    path: '/profile',
    component: MainLayout,
    meta: { auth: true },
    children: [
      {
        path: '',
        component: Profile,
      },
    ],
  },
  {
    path: '/payments',
    component: MainLayout,
    meta: { auth: true },
    children: [
      {
        path: '',
        component: Payments,
      },
    ],
  },
  {
    path: '/admin',
    component: MainLayout,
    meta: { auth: true },
    children: [
      {
        path: '',
        component: Admin,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuth()

  if (to.meta.auth && !(await auth.validate())) {
    return next('/login')
  }

  if ((to.path === '/login' || to.path === '/register') && auth.isAuth.value) {
    return next('/')
  }

  next()
})

app.use(router)

app.mount('#app')
