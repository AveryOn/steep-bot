import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import '../src/assets/media/viewport.css';

const app = createApp(App);


app
    .use(store)
    .mount('#app');
