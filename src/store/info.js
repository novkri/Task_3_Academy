import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },
  getters: {
    info: state => state.info
  },
  actions: {
    async FETCH_UDATA({dispatch, commit}) {
      try {
        const uid = await dispatch('GET_ID')
        const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
        commit('SET_INFO', info)
      } catch (error) {
        console.log(error);
      }
    }
  },
  mutations: {
    SET_INFO(state, info) {
      state.info = info
    },
    CLEAR_INFO(state) {
      state.info = {}
    }
  }
}