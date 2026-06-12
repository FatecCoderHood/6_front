// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MapaPage from '../pages/MapaPage.vue'
import HomePage from '../pages/HomePage.vue'
import UsersPage from '../pages/UsersPage.vue'
import LogsPage from '../pages/LogsPage.vue'
import LoginPage from '../pages/LoginPage.vue'  
import CadastroPage from '../pages/CadastroPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import MinhaConta from '../pages/MinhaConta.vue'
import AgentePrevisao from '../pages/AgentePrevisao.vue'
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
    meta: { title: 'sidebar.home', requiresAuth: true, roles: ['admin', 'user'] }  
  },
  { 
    path: '/mapa', 
    name: 'Mapa', 
    component: MapaPage,
    meta: { title: 'sidebar.map', requiresAuth: true, roles: ['admin', 'user'] }
  },
  { 
    path: '/agente-previsao', 
    name: 'AgentePrevisao', 
    component: AgentePrevisao,
    meta: { title: 'Agente de Previsão', requiresAuth: true, roles: ['admin', 'user'] }
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
    path: '/minha-conta',
    name: 'MinhaConta',
    component: MinhaConta, 
    meta: { title: 'Minha Conta', requiresAuth: true, roles: ['admin', 'user'] }
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
    const userRole = authUsecase.getUserRole()
    const allowed = requiredRoles.includes(userRole)
    if (!allowed) {
      return '/'
    }
  }

  return undefined
})

export default router