import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // форма для новой задачи
        newListForm: false,

        // задачи
        lists: []

        //подзадачи

    },
    getters: {
        // форма для новой задачи
        NEW_LIST_FORM: state => {
            return state.newListForm
        },

        // задачи
        LISTS: state => {
            return state.lists
        },
        COUNT_TASKS: state => index => {
            if (index) {
                return state.lists.find(list => list.id === index).tasks.length
            }
        }
        
    },
    mutations: {
        // форма для новой задачи
        SET_NEW_LIST_FORM: (state, payload) => {
            state.newListForm = payload
        },

        // задачи
        SET_LISTS: (state, payload) => {
            state.lists = payload
        },
        ADD_LIST: (state, payload) => {
            state.lists.push(payload)
        }
    },
    actions: {
        // задачи
        GET_LISTS: async ({commit}) => {
            let {data} = await axios.get('http://localhost:3000/lists')
            commit("SET_LISTS", data)
        },
        POST_LIST: ({commit}, payload) => {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/lists', payload).then(res => {
                    commit("ADD_LIST", res.data)
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                })
            })
                
                
                
            
        }
    }
})

