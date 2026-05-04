import { createRouter, createWebHistory } from 'vue-router'
import MapaPage from '../pages/MapaPage.vue'
import HomePage from '../pages/HomePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import LogsPage from '../pages/LogsPage.vue'
import ReservaPage from '../pages/ReservaPage.vue'
import i18n from '../i18n'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomePage,
    meta: { title: 'sidebar.home' }
  },
  { 
    path: '/mapa', 
    name: 'Mapa', 
    component: MapaPage,
    meta: { title: 'sidebar.map' }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardPage,
    meta: { title: 'sidebar.dashboard' }
  },
  { 
    path: '/usuarios', 
    name: 'Usuarios', 
    component: UsersPage,
    meta: { title: 'sidebar.users' }
  },
  { 
    path: '/logs', 
    name: 'Logs', 
    component: LogsPage,
    meta: { title: 'sidebar.logs' }
  },
  { 
    path: '/reserva', 
    name: 'Reserva', 
    component: ReservaPage,
    meta: { title: 'sidebar.reserve' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const baseTitle = 'Enersight'
  if (to.meta && to.meta.title) {
    // meta.title is a translation key now
    const translated = i18n.global.t(to.meta.title as string) as string
    document.title = `${translated} | ${baseTitle}`
  } else if (to.name) {
    document.title = `${String(to.name)} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
  next()
})

export default router