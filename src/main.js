import { VueElement, createApp } from 'vue';
import { createRouter, createWebHistory} from "vue-router";
import './output.css';
import App from './App.vue'
import HomePage from "./components/pages/Home.vue";

const routes = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/about',
        component: () => import("./components/pages/About.vue")
    },
    {
        path: '/projects',
        children: [
            {
                path: 'nebula',
                component: () => import("./components/pages/Project.vue"),
                props: {mdSource: "markdown/nebula"}
            },
            {
                path: 'dvz',
                component: () => import("./components/pages/Project.vue"),
                props: {mdSource: "markdown/dvz"}
            },
            {
                path: 'agm',
                component: () => import("./components/pages/Project.vue"),
                props: {mdSource: "markdown/agm"}
            }
        ]
    },
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'notfound',
    //     component: () => import("./components/pages/notfound.vue"),
    //     meta: {header: true}
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
