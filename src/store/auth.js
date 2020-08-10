import firebase from 'firebase/app'

export default {
    actions: {
        // async LOGIN({email, password}) {
        //     try {
        //         await firebase.auth().signInWithEmailAndPassword(email, password)
        //     } catch (error) {
        //         console.log(e)
        //         throw e
        //     }
        // },
        // async LOGOUT() {
        //     await firebase.auth().signOut()
        // },
        async REGISTER({dispatch}, {email, password, username}) {
            console.log(email, password, username);
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