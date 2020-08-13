import firebase from 'firebase/app'

export default {
  state: {
    newListForm: false,

    lists: [],

    tasks: [],
  },
  getters: {
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
    SET_NEW_LIST_FORM: (state, payload) => {
      state.newListForm = payload
    },

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
    // REMOVE_LIST: (state, payload) => {
    //   console.log("REMOVE_LIST", payload);
    //   state.lists = state.lists.filter(list => list.id !== payload)
    // },


    SET_TASKS: (state, payload) => {
      //       return state.tasks.filter(task => task.listid == listId)
      // console.log(rawTasks.filer(t => t.id));
      state.tasks = payload

    },

    // ADD_TASK: (state, { data, listId }) => {
    //   console.log("ADD_TASK",data, listId);
    //   // console.log(state.lists.find(list => list.id === 7).title);
    //   state.tasks.push(data)
    // },

    // REMOVE_TASK: (state, payload) => {
    //   console.log("REMOVE_TASK", payload);
    //   state.tasks = state.tasks.filter(task => task.id !== payload)
    // },

    // SET_TASK_STATUS: (state, payload) => {
    //   let s = state.tasks.filter(task => task.title == payload.title).isComplete = payload.isComplete
    //   // .filter(t => t.isComplete = isComplete)
    //   // state.tasks = state.tasks
    //   console.log(s);
    //   // state.tasks = payload
    //   console.log(state.tasks);
    // },
  },

  actions: {
    GET_LISTS: async ({dispatch, commit}) => {
      const uid = await dispatch('GET_ID')
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
    // DELETE_LIST: ({ commit }, payload) => {
    //   console.log(payload)
    //   return new Promise((resolve, reject) => {
    //     axios.delete(`http://localhost:3000/lists?id=${payload}`)
    //     .then(res => {
    //       console.log("REMOVE_LIST actions", payload);
    //       commit("REMOVE_LIST",  payload)
    //       resolve(res)
          
    //     })
    //     .catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    GET_TASKS: async ({ dispatch, commit}, listId) => {
      const uid = await dispatch('GET_ID')

      let tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      let tasksFiltered = []
      for (let i = 0; i < Object.values(tasks).length; i++) {
        if (Object.values(tasks)[i].listid == listId) {
          tasksFiltered.push(Object.values(tasks)[i]) 
        }
      }

      // commit("SET_TASKS", tasksFiltered, listId) 
      commit("SET_TASKS", tasksFiltered) 
      return tasksFiltered 
    },
    GET_RAW_TASKS: async ({ dispatch}, listId) => {
      const uid = await dispatch('GET_ID')
      console.log(listId);
      const rawTasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      // commit("SET_TASKS", rawTasks) 
      return rawTasks 
    },

     NEW_POST_TASK: async ({ dispatch}, {listid, title, isUrgent, isComplete, date}) => {
      const uid = await dispatch('GET_ID')
      await firebase.database().ref(`/users/${uid}/tasks`).push({listid, title, isUrgent, isComplete, date})
      dispatch('GET_TASKS', listid)

    },

    // DELETE_TASK: ({ commit }, {listid,index}) => {
    //   console.log("DELETE_TASK", listid, index)

    //   return new Promise((resolve, reject) => {
    //     axios.delete(`http://localhost:3000/tasks/${index}`)
    //       .then(res => {
    //         commit("REMOVE_TASK", index)
    //         resolve(res)
            
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },

    TOGGLE_TASK: async ({dispatch}, { thisListId, taskId, isComplete, title }) => {
      const uid = await dispatch('GET_ID')
      const t = await dispatch('GET_RAW_TASKS', thisListId)
      console.log(taskId);
      let thisTaskId = ''
      // let thisTask = {}

      for (let i = 0; i < Object.keys(t).length; i++) {
        if (Object.values(t)[i].listid == thisListId && Object.values(t)[i].title == title) {
            thisTaskId =  Object.keys(t)[i]
            // thisTask = Object.values(t)[i]
        }
      }
      // commit("SET_TASK_STATUS", {
      //   taskId,
      //   isComplete,
      //   thisListId,
      //   title
      // })
      await firebase.database().ref(`/users/${uid}/tasks/${thisTaskId}`).update({isComplete})      
    }
  }
}