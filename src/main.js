import Vue from 'vue'
import "./plugins/vuetify.js"
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

import store from './store'
import router from './router'

import App from './App.vue'
// import Login from './components/Auth/Login'
// import Register from './components/Auth/Register'
// import Todo from './components/Todo'
// import Tasks from './components/Tasks' 

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.use(VueRouter)


firebase.initializeApp({
  apiKey: "AIzaSyBPWHOB9CdceFdsd2rEcB5D5XId6uS5iRc",
  authDomain: "todoapp-6045f.firebaseapp.com",
  databaseURL: "https://todoapp-6045f.firebaseio.com",
  projectId: "todoapp-6045f",
  storageBucket: "todoapp-6045f.appspot.com",
  messagingSenderId: "566703804518",
  appId: "1:566703804518:web:0a550a18e05da2a112dda7"
})


let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  } 
})
