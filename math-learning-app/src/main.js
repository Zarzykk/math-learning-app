/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { VueTiptapKatex } from 'vue3-tiptap-katex';
const app = createApp(App)
app.component('VueTiptapKatex',VueTiptapKatex);
registerPlugins(app)

app.mount('#app')
