import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// La barra superior estándar (<dotrino-topbar>, montada en App.vue) ya trae la
// moneda de support, el chevron de "volver" (instala createBackNav por sí misma:
// botón físico de Android / gesto de iOS / atrás del navegador) y el perfil.
// Por eso la app no importa @dotrino/support ni @dotrino/nav directamente.

createApp(App).mount('#app')
