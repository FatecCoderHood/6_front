// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MapaPage from '../pages/MapaPage.vue'
import HomePage from '../pages/HomePage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import LogsPage from '../pages/LogsPage.vue'
import ReservaPage from '../pages/ReservaPage.vue'
import LoginPage from '../pages/LoginPage.vue'  
import CadastroPage from '../pages/CadastroPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import MinhaConta from '../pages/MinhaConta.vue'
import AgentePrevisao from '../pages/AgentePrevisao.vue'  // ADICIONE ESTA LINHA
import i18n from '../i18n'
import authUsecase from '../service/auth.usecase'

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
    path: '/agente-previsao',  // ADICIONE ESTA ROTA
    name: 'AgentePrevisao', 
    component: AgentePrevisao,
    meta: { title: 'Agente de Previsão', requiresAuth: true }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardPage,
    meta: { title: 'sidebar.dashboard', requiresAuth: true, roles: ['admin'] }
  },
  { 
    path: '/usuarios', 
    name: 'Usuarios', 
    component: UsersPage,
    meta: { title: 'sidebar.users', requiresAuth: true, roles: ['admin'] }
  },
  { 
    path: '/logs', 
    name: 'Logs', 
    component: LogsPage,
    meta: { title: 'sidebar.logs', requiresAuth: true, roles: ['admin'] }
  },
  { 
    path: '/reserva', 
    name: 'Reserva', 
    component: ReservaPage,
    meta: { title: 'sidebar.reserve', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/minha-conta',
    name: 'MinhaConta',
    component: MinhaConta, 
    meta: { title: 'Minha Conta', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFoundPage,
    meta: { title: 'Página Não Encontrada', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// (autenticação verificada via authUsecase)

// GUARD DE NAVEGAÇÃO
router.beforeEach((to, _from) => {
  const baseTitle = 'Enersigh'
  
  if (to.meta && to.meta.title) {
    const translated = i18n.global.t(to.meta.title as string) as string
    document.title = `${translated} | ${baseTitle}`
  } else if (to.name) {
    document.title = `${String(to.name)} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
  
  const auth = authUsecase.isAuthenticated()

  if (to.meta.requiresAuth && !auth) {
    return '/login'
  }

  // Prevent logged user from visiting login/register
  if ((to.path === '/login' || to.path === '/cadastro') && auth) {
    return '/'
  }

  // Role based guard if route defines roles
  const requiredRoles: string[] = (to.meta && (to.meta as any).roles) || []
  if (requiredRoles.length > 0 && auth) {
    // check if user has at least one required role
    const allowed = requiredRoles.some(r => authUsecase.hasRole(r))
    if (!allowed) {
      // redirect to home if not authorized
      return '/'
    }
  }

  // returning undefined continues the navigation
  return undefined
})

export default router