import firebase from 'firebase/app'

export default {
    actions: {
        async LOGIN({dispatch},{email, password}) {
            console.log(email, password)
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password)
                const uid = await dispatch('GET_ID')
                console.log(uid);
            } catch (error) {
                console.log(error);
            }
            
        },
        async LOGOUT({commit}) {
            await firebase.auth().signOut()
            commit('CLEAR_LISTS')
        },
        async REGISTER({dispatch}, {email, password, username}) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await dispatch('GET_ID')
                await firebase.database().ref(`/users/${uid}/info`).set({
                    username
                })
            } catch (e) {
                console.log(e)
                throw e
            }
        },
        GET_ID() {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        }
    }
}