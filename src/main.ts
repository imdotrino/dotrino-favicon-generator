import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@dotrino/support'
import { createBackNav } from '@dotrino/nav'

// Navegación "volver" unificada del ecosistema (chevron flotante + botón físico
// de Android / gesto de iOS / atrás del navegador → dotrino.com).
createBackNav()

createApp(App).mount('#app')