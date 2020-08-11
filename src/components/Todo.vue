<template>
<div>
  <v-app-bar color="grey darken-4" dark dense flat>
    <v-toolbar-title>Page title</v-toolbar-title>
    <v-spacer></v-spacer>
    {{ username }}
     <v-spacer></v-spacer>
    <v-btn @click="signOut">Выйти</v-btn>
  </v-app-bar>

  <v-container fluid>
    <v-row align-space-between justify-space-between>
      <v-col lg4>
        <Lists />
      </v-col>

      <v-col lg8>
        <router-view name="tasks" :key="$route.fullPath"></router-view>
      </v-col>
    </v-row>
  </v-container>
</div>

</template>

<script>
import Lists from './Lists'
// import firebase from 'firebase/app'

  export default {
    name: "todo",
    data: () => ({
      isVisible: false,
      emailLogged: ''
    }),
    components: {
      Lists,
    },
    computed: {
      username() {
        return this.$store.getters.info.username
      }
    },
    async mounted() {

      if (!Object.keys(this.$store.getters.info).length) {
        await this.$store.dispatch('FETCH_UDATA')
      }

    },
    methods: {
      async signOut() {
        try {
          await this.$store.dispatch('LOGOUT')
          this.$router.push('/login')
        } catch (error) {
          console.log(error);
        }
        
      }
    }
  }
</script>