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
        COUNT_TASKS: state => index => {
            if (index) {
                return state.lists.find(list => list.id === index).tasks.length
            }
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

        // подхадачи
        SET_TASKS: (state, {dataTask, listid}) => {
            // console.log("set ",payload);
            console.log(listid);
            state.tasks = dataTask
        },
        ADD_TASK: (state, {data}) => {
            let {id, ...rest} = data
            console.log(id, rest);
            console.log("ADD_TASK");
            console.log(state.lists.find(list => list.id === id));
            state.lists.find(list => list.id === id).tasks = rest
            // let tasksArr = state.lists.find(list => list.id === id).tasks
            // tasksArr.push(rest)
        },
        
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
        },

        // подзадачи
        GET_TASKS: async ({commit}, payload) => {
            let {data} = await axios.get(`http://localhost:3000/lists/${payload}`)
            let dataTask = data.tasks
            commit("SET_TASKS", {dataTask, listid: payload})
        },

        POST_TASK: ({commit}, {listid, ...rest}) => {
            return new Promise((resolve, reject) => {
                console.log("payload task ",listid, "and ", rest);
                axios.put(`http://localhost:3000/lists/${listid}`, rest).then(res => {
                    console.log('here', res, res.data.id);
                    // let id = res.data.id
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

