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
      return state.tasks.sort(function (a, b) {
        return (new Date(a.date) > new Date(b.date)) ? -1 : 1
      })
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
    ADD_LIST: (state, payload) => {
      state.lists.push(payload)
    },
    CLEAR_LISTS: (state) => {
      state.lists = {}
    },
    REMOVE_LIST: (state, payload) => {
      state.lists = state.lists.filter(list => list.id !== payload)
    },
    SORT: (state) => {
      state.lists = state.lists.sort(function (a, b) {
        return (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1
      })
    },


    SET_TASKS: (state, payload) => {
      state.tasks = payload
    },

    ADD_TASK: (state, payload) => {
      state.tasks.push(payload)
    },

    REMOVE_TASK: (state, payload) => {
      console.log("REMOVE_TASK",state.tasks, payload);
      state.tasks = state.tasks.filter(task => task.id !== payload)
    },

  },

  actions: {
    GET_LISTS: async ({dispatch, commit}) => {
      const uid = await dispatch('GET_ID')
      const lists = (await firebase.database().ref(`/users/${uid}/lists`).once('value')).val() || {}
      
      const listsWithId = Object.keys(lists).map(key => ({...lists[key], id: key}))
      
      commit("SET_LISTS", listsWithId)

      return listsWithId
    },
    async NEW_LIST_POST({dispatch, commit}, {title, tags}) {
      try {
          const uid = await dispatch('GET_ID')
          const list = await firebase.database().ref(`/users/${uid}/lists`).push({title, tags})
          await commit('ADD_LIST', {title, tags, id: list.key})
          await dispatch("GET_LISTS")
          return {title, tags, id: list.key}
      } catch (e) {
          console.log(e)
          throw e
      }
    },
    DELETE_LIST: async ({dispatch, commit}, {index}) => {
      console.log(index)
      const uid = await dispatch('GET_ID')
      await firebase.database().ref().child(`/users/${uid}/lists/${index}`).remove()
      await commit('REMOVE_LIST', index)
    },
    EDIT_LIST: async ({dispatch}, newList) => {
      const uid = await dispatch('GET_ID')
      await firebase.database().ref().child(`/users/${uid}/lists/${newList.id}`).update({title: newList.title})
    },

    GET_TASKS: async ({ dispatch, commit}, listId) => {
      const uid = await dispatch('GET_ID')

      let tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      const tasksWithId = Object.keys(tasks).map(key => ({...tasks[key], id: key}))

      let tasksFiltered = []
      let isCompleted = []
      for (let i = 0; i < Object.values(tasksWithId).length; i++) {
        if (Object.values(tasksWithId)[i].listid == listId) {
          tasksFiltered.push(Object.values(tasksWithId)[i], )
          if (Object.values(tasksWithId)[i].isComplete) {
            isCompleted.push(Object.values(tasksWithId)[i].isComplete)
          }
        }
      }
      commit("SET_TASKS", tasksFiltered)
      // commit("SET_COMPLETED", isCompleted)
      return tasksFiltered
    },

     NEW_POST_TASK: async ({ dispatch, commit }, {listid, title, isUrgent, isComplete, date}) => {
      const uid = await dispatch('GET_ID')
      
      await firebase.database().ref(`/users/${uid}/tasks`).push({listid, title, isUrgent, isComplete, date})
      await firebase.database().ref(`/users/${uid}/lists/${listid}`).update({completed: isComplete})
      await commit('ADD_TASK', {listid, title, isUrgent, isComplete, date})
    },

    DELETE_TASK: async ({dispatch, commit }, {thisListId, index}) => {
      console.log("DELETE_TASK",thisListId, index)
      const uid =  await dispatch('GET_ID')
      let r = await dispatch('GET_LISTS')
      let listId = r[thisListId].id

      let t = await dispatch('GET_TASKS', listId)

      await firebase.database().ref(`/users/${uid}/lists/${listId}`).update({completed: {}})
      await firebase.database().ref().child(`/users/${uid}/tasks/${t[index].id}`).remove()
      await commit('REMOVE_TASK', t[index].id)
    },

    
    TOGGLE_TASK: async ({dispatch }, { thisListId, taskId, isComplete, title }) => {
      const uid = await dispatch('GET_ID')

      let tasks = (await firebase.database().ref(`/users/${uid}/tasks`).once('value')).val() || {}
      const tasksWithId = Object.keys(tasks).map(key => ({...tasks[key], id: key}))

      let tasksFiltered = []
      let isCompleted = []
      for (let i = 0; i < Object.values(tasksWithId).length; i++) {
        if (Object.values(tasksWithId)[i].listid == thisListId) {
          tasksFiltered.push(Object.values(tasksWithId)[i], )
          if (Object.values(tasksWithId)[i].isComplete) {
            isCompleted.push(Object.values(tasksWithId)[i].isComplete)
          }
        }
      }

      console.log(tasksFiltered[taskId].id, thisListId, taskId, isComplete, title)
      // let thisTaskId = ''

      // for (let i = 0; i < Object.keys(t).length; i++) {
      //   if (Object.values(t)[i].listid == thisListId && Object.values(t)[i].title == title) {
      //       thisTaskId =  Object.keys(t)[i]
      //   }
      // }
      await firebase.database().ref(`/users/${uid}/lists/${thisListId}`).update({completed: false})
      await firebase.database().ref(`/users/${uid}/tasks/${tasksFiltered[taskId].id}`).update({isComplete})
      

      const t = await dispatch('GET_TASKS', thisListId)
      let arrCompleted = []
      for (let i = 0; i < t.length; i++) {
        if (t[i].isComplete == true) {
          arrCompleted.push(t[i].isComplete)
        }
      }

      if (arrCompleted.length == t.length) {
        await firebase.database().ref(`/users/${uid}/lists/${thisListId}`).update({completed: true})

      }
      // await commit('SET_LIST_STATUS', thisListId)
      // await dispatch('GET_LISTS')
    }
  }
}