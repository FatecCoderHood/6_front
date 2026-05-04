import { createApp, watch } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import i18n from './i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

// Configurar título dinâmico baseado na rota
const baseTitle = 'Enersight'

function updateDocumentTitle() {
  const to = router.currentRoute.value
  if (to && to.meta && to.meta.title) {
    const translated = i18n.global.t(to.meta.title as string) as string
    document.title = `${translated} | ${baseTitle}`
  } else if (to && to.name) {
    document.title = `${String(to.name)} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }
}

// set title after each navigation
router.afterEach(() => {
  updateDocumentTitle()
})

// watch locale changes and update title when language toggles
watch(() => i18n.global.locale.value, () => {
  updateDocumentTitle()
})