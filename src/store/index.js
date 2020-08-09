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
    tasks: [],

    //фильтры
    sortBy: '',
    filterBy: ''
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
    },
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
      console.log("REMOVE_LIST", payload);
      state.lists = state.lists.filter(list => list.id !== payload)
    },

    // подзадачи
    SET_TASKS: (state, {data}) => {
      state.tasks = data
    },

    ADD_TASK: (state, { data }) => {
      console.log("ADD_TASK",data);
      state.tasks.push(data)
    },

    REMOVE_TASK: (state, payload) => {
      console.log("REMOVE_TASK", payload);
      state.tasks = state.tasks.filter(task => task.id !== payload)
    },


    SET_TASK_STATUS: (state, payload) => {
      console.log("SET_TASK_STATUS", payload, payload.isComplete)
      state.tasks.find(task => task.id === payload.taskId).isComplete = payload.isComplete
    //   // console.log(state.tasks.find(task => task.id === taskId));

    //   // let data = 
    //   state.tasks = state.tasks.find(task => task.id === payload.taskId)
    //   // data = state.tasks
    //   console.log("state.tasks", state.tasks);
    //   // state.tasks.push(data)
      
    },

    //сортировка
    SET_LIST_SORT: (state, {val}) => {
      state.lists.sortValue = val
      console.log(state.lists);
    },
    SORT_LIST_BY: (state, {val}) => {
      state.lists.sort((a, b) => a[val] < b[val] ? -1 : 1)
      console.log(state.lists);
    },


    //filter
    SET_LIST_FILTER: (state, {val}) => {
      state.lists.filterValue = val
      console.log(state.lists);
    },
    FILTER_LIST_BY: (state, {filter_query}) => {
      //!!!!!!!
      let tasks = state.tasks.find(list => list.isComplete === true)

      // let arrTasks = Array.from(tasks)
      console.log("tasks", tasks);
      // let arr = []
      console.log(filter_query);
      
      // switch (filter_query) {
      //   case "remaining":
      //     arr = tasks.filter(task => {
      //       return !task.isComplete
      //     })
      //     break

      //     case "completed":
      //     arr = tasks.filter(task => {
      //       return task.isComplete
      //     })
      //     break

      //     case "all":
      //     arr = tasks
      //     break
      // }
      // state.lists.find(list => list.id === 2).tasks = [...arr]
    },


  },
  actions: {
    // задачи
    GET_LISTS: async ({ commit }) => {
      let { data } = await axios.get('http://localhost:3000/lists')
      commit("SET_LISTS", data)
    },
    POST_LIST: ({ commit }, payload) => {
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

    DELETE_LIST: ({ commit }, payload) => {
      console.log(payload)
      return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3000/lists?id=${payload}`)
        .then(res => {
          console.log("REMOVE_LIST actions", payload);
          commit("REMOVE_LIST",  payload)
          resolve(res)
          
        })
        .catch(error => {
          reject(error)
        })
      })
    },


    // подзадачи
    GET_TASKS: async ({ commit }, payload) => {
      let { data } = await axios.get(`http://localhost:3000/lists/${payload}/tasks`)
      commit("SET_TASKS", {data,listid: payload})
    },

    POST_TASK: ({ commit }, {listid,...rest}) => {
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

    DELETE_TASK: ({ commit }, {listid,index}) => {
      console.log("DELETE_TASK", listid, index)
      return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3000/tasks/${index}`)
          .then(res => {
            commit("REMOVE_TASK", index)
            resolve(res)
            
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    TOGGLE_TASK: async ({ commit }, { taskId, isComplete, listId }) => {
      console.log( taskId, isComplete, listId);
      let { data } = await axios.patch(`http://localhost:3000/tasks/${taskId}`, {isComplete: true})
      console.log("TOGGLE_TASK", data);
      commit("SET_TASK_STATUS", {
        data,
        taskId,
        isComplete,
        listId
      });
    },

    

    //фильтры
    SORT_BY: ({ commit }, {val}) => {
      axios.get(`http://localhost:3000/lists`, {
        sortBy: val
      })
      .then(response => {
        console.log("SORT_BY",response);
        commit("SET_LIST_SORT", {val})
        commit("SORT_LIST_BY", {val})
      })
      .catch(error => console.log(error))
    },



    FILTER_BY: ({ commit }, {val}) => {
      axios.get(`http://localhost:3000/lists`, {
        filterBy: val
      })
      .then(response => {
        console.log("FILTER_BY",response);
        commit("SET_LIST_FILTER", {val})
        commit("FILTER_LIST_BY", {filter_query: val})
      })
      .catch(error => console.log(error))
    },
  }
})