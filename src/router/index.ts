import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 如果访问登录页且已登录，跳转到首页
  if (to.path === '/login' && token) {
    next('/')
    return
  }
  
  // 如果访问其他页面且未登录，跳转到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }
  
  next()
})

export default router 