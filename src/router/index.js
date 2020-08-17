import VueRouter from 'vue-router'

import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import Todo from '../components/Todo'
import Tasks from '../components/Tasks'

import firebase from 'firebase/app'

const routes = [
    {
      path: '/',
      // components: () => import('../components/Todo'),
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
              name: "task"
            }
          ]
        },
      ],
      meta: {requiresAuth: true}
    }, 
    {
    path: '/login',
    // components: () => import('../components/Auth/Login'),
    component: Login,
    name: 'login'
    },
    {
      path: '/register',
      // components: () => import('../components/Auth/Register'),
      component: Register,
      name: 'register'
    }
    
  ]
  
  const router = new VueRouter({
    mode: 'history',
    routes,
    base: '/'
  })
  
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthed = firebase.auth().currentUser
    if (requiresAuth && !isAuthed) {
      next("/login")
    } else {
      next()
    }
  })
  
  export default router