import { createRouter, createWebHistory } from 'vue-router'
import MapaPage from '../pages/MapaPage.vue'
import HomePage from '../pages/HomePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import LogsPage from '../pages/LogsPage.vue'
import ReservaPage from '../pages/ReservaPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/mapa', name: 'Mapa', component: MapaPage },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
  { path: '/usuarios', name: 'Usuarios', component: UsersPage },
  { path: '/logs', name: 'Logs', component: LogsPage },
  { path: '/reserva', name: 'Reserva', component: ReservaPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
