import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import User from '../views/User.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', name: 'Login', component: Login},
    {path: '/', name: 'Layout', component: Layout, redirect: '/user',
      children: [
        {path: 'user', name: 'User', component: User},
        {path: 'admin', name: 'Admin', component: Admin}
      ]
    }
  ],
})

export default router
