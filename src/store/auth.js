import firebase from 'firebase/app'

export default {
    actions: {
        // async LOGIN(p) {
        //     console.log("LOGIN");
        //     console.log(p);
        //     // try {
        //     //     await firebase.auth().signInWithEmailAndPassword(email, password)
        //     // } catch (error) {
        //     //     console.log(error)
        //     //     throw error
        //     // }
        // },
        async LOGOUT({commit}) {
            await firebase.auth().signOut()
            commit('CLEAR_INFO') //еще нет
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