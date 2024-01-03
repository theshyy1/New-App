import { createApp } from "vue";
import "./style.css";
import "./styles/index.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(Vue3Toastify).mount("#app");
