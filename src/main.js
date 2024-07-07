import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import {createRouter, createWebHistory} from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import LoginComponent from './components/LoginComponent.vue';

const router = createRouter({
    history: createWebHistory(),
    routes : [{
        name: 'HelloWorld',
        path: '/',
        component: HelloWorld
    }, {
        name: 'Login',
        path: '/auth',
        component: LoginComponent
    }]
})

createApp(App)
    .use(router)
    .mount('#app')
