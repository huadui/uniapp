import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import User from '../views/User.vue'
import Admin from '../views/Admin.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', name: 'Login', component: Login},
    {path: '/', name: 'Layout', component: Layout, redirect: '/dashboard',
      children: [
        {path: 'dashboard', name: 'Dashboard', component: Dashboard},
        {path: 'user', name: 'User', component: User},
        {path: 'admin', name: 'Admin', component: Admin}
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  const adminInfoStr = localStorage.getItem('adminInfo')
  if (!adminInfoStr) {
    next('/login')
    return
  }
  try {
    const adminInfo = JSON.parse(adminInfoStr)
    if (to.path === '/admin' && adminInfo.role !== '超级管理员') {
      ElMessage.error('无权限访问管理员页面')
      next('/user')
      return
    }
  } catch(e) {}
  next()
})

export default router
