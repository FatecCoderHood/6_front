import { createRouter, createWebHistory } from 'vue-router'
import MapaPage from '../pages/MapaPage.vue'
import HomePage from '../pages/HomePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import LogsPage from '../pages/LogsPage.vue'
import ReservaPage from '../pages/ReservaPage.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomePage,
    meta: { title: 'Início' }
  },
  { 
    path: '/mapa', 
    name: 'Mapa', 
    component: MapaPage,
    meta: { title: 'Mapa de Redes Elétricas' }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardPage,
    meta: { title: 'Dashboard de Indicadores' }
  },
  { 
    path: '/usuarios', 
    name: 'Usuarios', 
    component: UsersPage,
    meta: { title: 'Gestão de Usuários' }
  },
  { 
    path: '/logs', 
    name: 'Logs', 
    component: LogsPage,
    meta: { title: 'Histórico de Logs' }
  },
  { 
    path: '/reserva', 
    name: 'Reserva', 
    component: ReservaPage,
    meta: { title: 'Reserva de Salas' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const baseTitle = 'Enersight'
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} | ${baseTitle}`
  } else if (to.name) {
    document.title = `${to.name} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
  next()
})

export default router