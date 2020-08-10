//doesnt work :((

// import firebase from 'firebase/app'

// export default {
//   state: {
//     email: '',
//     password: '',
//     username: '',
//     user: {}
//   },
//   getters: {
//     USERNAME: state => {
//       return state.username
//     }
//   },
//   actions: {
//     // {dispatch, commit},
//     async login( payload ) {
//       console.log( payload );
//       try {
//         await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
//       } catch (e) {
//         console.log(e);
//         throw e
//       }
//     }
//     // GET_USER: () => {

//     // }
//   },
//   mutations: {
//     SET_USER: (state, user) => {
//       state.user= user
//     }
//   }
// }