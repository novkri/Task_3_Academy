<template>
<div>
  <v-app-bar color="grey darken-4" dark dense flat>
    <v-toolbar-title>Page title</v-toolbar-title>
    <v-spacer></v-spacer>
    Пользователь: {{ username }}
     <v-spacer></v-spacer>
    <v-btn @click="signOut">Выйти</v-btn>
  </v-app-bar>

  <v-container style="width: fit-content;">
    <v-progress-circular v-if="loader"
      indeterminate
      color="red"
    ></v-progress-circular>
  </v-container>

  <v-container fluid v-if="!loader">
    <v-row align-space-between justify-space-between>
      <v-col lg4 sm12 xs12 wrap>
        <Lists />
      </v-col>

      <v-col lg8 sm12 xs12 wrap>
        <span v-if="this.$route.path === '/'">Вы можете добавить подзадачи к задаче, кликнув по ней в списке</span>
        
        <router-view name="tasks" :key="$route.fullPath"></router-view>
      </v-col>
    </v-row>
  </v-container>
</div>

</template>

<script>

  export default {
    name: "todo",
    data: () => ({
      loader: true,
      isVisible: false,
      emailLogged: '',
    }),
    components: {
      Lists: () => import('./Lists'),
    },
    computed: {
      username() {
        return this.$store.getters.info.username
      },

    },
    async mounted() {
      if (!Object.keys(this.$store.getters.info).length) {
        await this.$store.dispatch('FETCH_UDATA')
      }
      await this.$store.dispatch('GET_LISTS').then(this.loader = false)

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