/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import Login from "@/views/Login.vue";
import axios from 'axios';
import { createApp } from 'vue'
import { VueTiptapKatex } from 'vue3-tiptap-katex';
import { createRouter, createWebHistory} from "vue-router";

axios.defaults.baseURL = 'http://localhost:8080/';


const routes = [
  { path: '/', component: Login }, // Ustawienie Login jako domyślnego komponentu dla głównej ścieżki
  // Możesz dodać więcej tras tutaj
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
const app = createApp(App)
app.component('VueTiptapKatex',VueTiptapKatex);
app.config.globalProperties.$axios = axios;
registerPlugins(app)

app.mount('#app')
