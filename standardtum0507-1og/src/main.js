import { createApp } from 'vue'
import App from './App.vue'
import Konva from 'konva';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App);
app.config.globalProperties.$konva = Konva;
app.use(ElementPlus);
app.mount('#app');
