import { createApp } from 'vue';
import App from './App.vue';
import { store, key } from './store';
import router from './router';
// import './assets/shared.css';

const app = createApp(App);
app.use(store, key).use(router);
app.mount('#app');
