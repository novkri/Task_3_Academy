<template>
   <v-app>
     <v-app-bar
      color="grey darken-4" dark
      dense
      flat
    >
      <v-toolbar-title>Page title</v-toolbar-title>
    </v-app-bar>

    
      <v-main>
        <router-view></router-view>
      </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'app',
}
</script>
