import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import data from './data'
import info from './info'

// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  actions: {
  },
  modules: {
    auth,
    data,
    info
  }
})