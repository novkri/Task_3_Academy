// import Vue from 'vue'
// import Vuex from 'vuex'
// import auth from './auth'
// import axios from 'axios'

// Vue.use(Vuex)
import axios from 'axios'
import firebase from 'firebase/app'

export default {
  state: {
    newListForm: false,

    lists: [],

    tasks: [],

    sortBy: '',
    filterBy: ''
  },
  getters: {
    // форма для новой задачи
    NEW_LIST_FORM: state => {
      return state.newListForm
    },

    LISTS: state => {
      return state.lists
    },

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
    // ADD_LIST: (state, payload) => {
    //   console.log(payload);
    //   state.lists.push(payload)
    // },
    CLEAR_LISTS: (state) => {
      state.lists = {}
    },
    REMOVE_LIST: (state, payload) => {
      console.log("REMOVE_LIST", payload);
      state.lists = state.lists.filter(list => list.id !== payload)
    },

    // подзадачи
    SET_TASKS: (state, payload) => {
      state.tasks = payload
    },
    // SET_TASKS: (state, { data, listId }) => {
    //   Vue.set(
    //     state.lists.find(list => list.id === listId),
    //     "curatedTasks",
    //     data
    //   );
    //   state.lists.find(list => list.id === listId).tasks = data;

    ADD_TASK: (state, { data, listId }) => {
      console.log("ADD_TASK",data, listId);
      // console.log(state.lists.find(list => list.id === 7).title);
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
      console.log("SET_LIST_FILTER", state.lists, val,state.lists.filterValue = val );
    },

    FILTER_LIST_BY: (state, {filter_query}) => {
      let tasks = state.tasks
      let arr = []

      switch (filter_query) {
        case "remaining":
          arr = tasks.filter(task => {
            return !task.isComplete
          })
          break

          case "completed":
          arr = tasks.filter(task => {
            return task.isComplete
          })
          console.log(arr);
          break

          case "all":
          arr = tasks
          break
      }
      state.tasks = [...arr]
    },


  },
  actions: {
    // задачи
    GET_LISTS: async ({dispatch, commit}) => {
      const uid = await dispatch('GET_ID')
      console.log(uid, "uid");
      const lists = (await firebase.database().ref(`/users/${uid}/lists`).once('value')).val() || {}
      console.log(lists);
      const listsWithId = Object.keys(lists).map(key => ({...lists[key], id: key}))
      commit("SET_LISTS", listsWithId)
      return listsWithId

    },
    async NEW_LIST_POST({dispatch}, {title}) {
      try {
          const uid = await dispatch('GET_ID')
          const list = await firebase.database().ref(`/users/${uid}/lists`).push({title})
          await dispatch('GET_LISTS')

          return {title, id: list.key}
      } catch (e) {
          console.log(e)
          throw e
      }
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
    GET_TASKS: async ({ dispatch, commit}, listId) => {
      const uid = await dispatch('GET_ID')

      
      let tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      let tasksFiltered = []
      for (let i = 0; i < Object.values(tasks).length; i++) {
        if (Object.values(tasks)[i].listid == listId) {
          tasksFiltered.push(Object.values(tasks)[i]) 
        }
      }
      commit("SET_TASKS", tasksFiltered)
      return tasksFiltered 

    },

     NEW_POST_TASK: async ({ dispatch}, {listid, title, isUrgent, date}) => {
      const uid = await dispatch('GET_ID')


      await firebase.database().ref(`/users/${uid}/tasks`).push({listid, title, isUrgent, date})
      dispatch('GET_TASKS', listid)

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
      let { data } = await axios.patch(`http://localhost:3000/tasks/${taskId}`, {isComplete})
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
        console.log(response);

        commit("SET_LIST_FILTER", {val})
        commit("FILTER_LIST_BY", {filter_query: val})
      })
      .catch(error => console.log(error))
    },
  }
}