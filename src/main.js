import Vue from 'vue'
import "./plugins/vuetify.js"
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

import store from './store'

import App from './App.vue'
import Todo from './components/Todo'
import Tasks from './components/Tasks'


Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Todo,
    name: 'todo',
    children: [
      {
        path: '/list/:id',
        components: { tasks: Tasks},
        name: 'tasks',
        children: [
          {
            path: "task/:taskId",
            // components: { notes: NotesModal },
            name: "task"
          }
        ]
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  base: '/'
})


new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
