<template>
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
</template>

<script>
  import Lists from './Lists'

  export default {
    name: "todo",
    components: {
      Lists,
    },
    data: () => ({
      isVisible: false
    })
    
  }
</script>
