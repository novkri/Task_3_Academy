import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // форма для новой задачи
        newListForm: false,

        // задачи
        lists: [],

        //подзадачи
        tasks: []
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

        // подзадачи
        TASKS: state => {
            return state.tasks
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
        },

        REMOVE_LIST: (state, payload) => {
            state.lists.shift(payload)
        },


        // подзадачи
        SET_TASKS: (state, {data, listid}) => {
            state.tasks = data
            console.log(listid);
        },

        ADD_TASK: (state, {data}) => {
            let {id, ...rest} = data
            console.log(id);
            state.tasks.push(rest)
        },
        
    },
    actions: {
        // задачи
        GET_LISTS: async ({commit}) => {
            let {data} = await axios.get('http://localhost:3000/lists')
            commit("SET_LISTS", data)
        },
        POST_LIST: ({commit}, payload) => {
            console.log("POST_LIST", payload);
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:3000/lists', payload).then(res => {
                    commit("ADD_LIST", res.data)
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                })
            })
        },

        DELETE_LIST: async ({commit}, payload) => {
            // payload == id
            console.log(payload);
            // let {data} = 
            await axios.delete(`http://localhost:3000/lists?id=${payload}`).then(res => {
                commit("REMOVE_LIST", res.data)
            })
            
        },

        
        // подзадачи
        GET_TASKS: async ({commit}, payload) => {
            let {data} = await axios.get(`http://localhost:3000/lists/${payload}/tasks`)
            commit("SET_TASKS", {data, listid: payload})
        },

        POST_TASK: ({commit}, {listid, ...rest}) => {
            return new Promise((resolve, reject) => {
                axios.post(`http://localhost:3000/lists/${listid}/tasks`, rest).then(res => {
                    commit("ADD_TASK", res)
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
    }
})

