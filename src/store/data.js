import firebase from 'firebase/app'

export default {
  state: {
    newListForm: false,

    lists: [],

    tasks: [],
    isCompleted: []
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
    DONE_TASKS: state => {
      return state.isCompleted
    }
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
      state.tasks = payload
    },
    SET_COMPLETED: (state, payload) => {
      state.isCompleted = payload
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
    DELETE_LIST: async ({dispatch}, {index}) => {
      console.log(index)
      const uid = await dispatch('GET_ID')
      await firebase.database().ref().child(`/users/${uid}/lists/${index}`).remove()
      await dispatch('GET_LISTS')
    },

    GET_ALL_TASKS: async ({ dispatch }) => {
      const uid = await dispatch('GET_ID')

      let tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      const tasksWithId = Object.keys(tasks).map(key => ({...tasks[key], id: key}))
      return tasksWithId
    }, 

    GET_TASKS: async ({ dispatch, commit}, listId) => {
      const uid = await dispatch('GET_ID')

      let tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      let tasksFiltered = []
      let isCompleted = []
      for (let i = 0; i < Object.values(tasks).length; i++) {
        if (Object.values(tasks)[i].listid == listId) {
          tasksFiltered.push(Object.values(tasks)[i])
          if (Object.values(tasks)[i].isComplete) {
            isCompleted.push(Object.values(tasks)[i].isComplete)
          }
        }
      }
      commit("SET_TASKS", tasksFiltered)
      commit("SET_COMPLETED", isCompleted)
      return tasksFiltered
    },
    GET_RAW_TASKS: async ({ dispatch}) => {
      const uid = await dispatch('GET_ID')
      const rawTasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      return rawTasks 
    },

     NEW_POST_TASK: async ({ dispatch}, {listid, title, isUrgent, isComplete, date}) => {
      const uid = await dispatch('GET_ID')
      await firebase.database().ref(`/users/${uid}/tasks`).push({listid, title, isUrgent, isComplete, date})
      await firebase.database().ref(`/users/${uid}/lists/${listid}`).update({completed: isComplete})
      await dispatch('GET_TASKS', listid)
    },

    DELETE_TASK: async ({dispatch}, {thisListId, index}) => {
      console.log("DELETE_TASK",thisListId, index)
      const uid = await dispatch('GET_ID')
      let r = await dispatch('GET_LISTS')
      let listId = r[thisListId].id
      let t = await dispatch('GET_RAW_TASKS')

      let thisTasks = []
      for (let i = 0; i < Object.keys(t).length; i++) {
        if (Object.values(t)[i].listid == listId) {
          thisTasks.push(Object.keys(t)[i])
        }
      }

      let thisId = ''
      for (let i = 0; i < thisTasks.length; i++) {
        if (i == index) {
          thisId = thisTasks[i]
        }
        
      }

      await firebase.database().ref().child(`/users/${uid}/tasks/${thisId}`).remove().then(console.log('removes'))
      await dispatch('GET_TASKS', listId)
      await firebase.database().ref(`/users/${uid}/lists/${listId}`).update({completed: null})
      await dispatch('GET_LISTS')
    },

    TOGGLE_TASK: async ({dispatch}, { thisListId, taskId, isComplete, title }) => {
      const uid = await dispatch('GET_ID')
      const t = await dispatch('GET_RAW_TASKS')

      console.log(taskId);
      let thisTaskId = ''

      for (let i = 0; i < Object.keys(t).length; i++) {
        if (Object.values(t)[i].listid == thisListId && Object.values(t)[i].title == title) {
            thisTaskId =  Object.keys(t)[i]
        }
      }

      await firebase.database().ref(`/users/${uid}/tasks/${thisTaskId}`).update({isComplete})
      await firebase.database().ref(`/users/${uid}/lists/${thisListId}`).update({completed: false})

      let x = await dispatch('GET_TASKS', thisListId)
      let arrCompleted = []
      for (let i = 0; i < x.length; i++) {
        if (x[i].isComplete == true) {
          arrCompleted.push(x[i].isComplete)
        }
      }

      if (arrCompleted.length == x.length) {
        await firebase.database().ref(`/users/${uid}/lists/${thisListId}`).update({completed: true})
      }
      await dispatch('GET_LISTS')
    }
  }
}