import { createRouter, createWebHistory } from 'vue-router'
import MapaPage from '../pages/MapaPage.vue'
import HomePage from '../pages/HomePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import LogsPage from '../pages/LogsPage.vue'
import ReservaPage from '../pages/ReservaPage.vue'
import LoginPage from '../pages/LoginPage.vue'  
import CadastroPage from '../pages/CadastroPage.vue'
import i18n from '../i18n'

const routes = [
  { 
    path: '/login',  
    name: 'Login', 
    component: LoginPage,
    meta: { title: 'Login', requiresAuth: false }  
  },
  {
  path: '/cadastro', 
    name: 'Cadastro', 
    component: CadastroPage,
    meta: { title: 'Cadastro', requiresAuth: false }
  },
  { 
    path: '/', 
    name: 'Home', 
    component: HomePage,
    meta: { title: 'sidebar.home', requiresAuth: true }  
  },
  { 
    path: '/mapa', 
    name: 'Mapa', 
    component: MapaPage,
    meta: { title: 'sidebar.map', requiresAuth: true }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardPage,
    meta: { title: 'sidebar.dashboard', requiresAuth: true }
  },
  { 
    path: '/usuarios', 
    name: 'Usuarios', 
    component: UsersPage,
    meta: { title: 'sidebar.users', requiresAuth: true }
  },
  { 
    path: '/logs', 
    name: 'Logs', 
    component: LogsPage,
    meta: { title: 'sidebar.logs', requiresAuth: true }
  },
  { 
    path: '/reserva', 
    name: 'Reserva', 
    component: ReservaPage,
    meta: { title: 'sidebar.reserve', requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// FUNÇÃO PARA VERIFICAR AUTENTICAÇÃO
const isAuthenticated = () => {
  // Verifica se tem usuário logado no localStorage ou sessionStorage
  const user = localStorage.getItem('user') || sessionStorage.getItem('user')
  return !!user
}

// GUARD DE NAVEGAÇÃO (PROTEÇÃO DE ROTAS)
router.beforeEach((to, _from, next) => {
  // Atualizar título da página
  const baseTitle = 'Enersight'
  if (to.meta && to.meta.title) {
    const translated = i18n.global.t(to.meta.title as string) as string
    document.title = `${translated} | ${baseTitle}`
  } else if (to.name) {
    document.title = `${String(to.name)} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
  
  // VERIFICAR AUTENTICAÇÃO
  const auth = isAuthenticated()
  
  // Se a rota requer autenticação e usuário não está logado
  if (to.meta.requiresAuth && !auth) {
    next('/login')  // Redireciona para login
  } 
  // Se usuário está logado e tenta acessar login
  else if (to.path === '/login' && auth) {
    next('/')  // Redireciona para home
  }
  else {
    next()  // Permite acesso
  }
})

export default router