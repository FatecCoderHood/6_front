import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Configurar título dinâmico baseado na rota
router.afterEach((to) => {
  const baseTitle = 'Enersight'
  const titles: Record<string, string> = {
    'Home': 'Início',
    'Mapa': 'Mapa de Redes Elétricas',
    'Dashboard': 'Dashboard de Indicadores',
    'Usuarios': 'Gestão de Usuários',
    'Logs': 'Histórico de Logs',
    'Reserva': 'Reserva de Salas'
  }
  
  const pageTitle = to.name ? titles[to.name as string] : ''
  
  if (pageTitle) {
    document.title = `${pageTitle} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
})