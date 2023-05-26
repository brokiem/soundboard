import { createApp } from "vue";
import "./assets/styles.css";
import App from "./App.vue";
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount("#app");
