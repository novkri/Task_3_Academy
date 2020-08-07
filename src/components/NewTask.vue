<template>
  <v-form @submit.prevent="submit()">
    <!-- внешний вид -->
      <!-- <v-row justify="space-between">
        <v-col lg="7" > -->
          <v-text-field v-model="title" solo label="Добавить новую подзадачу" append-icon="add" placeholder="Название">
          </v-text-field>
        <!-- </v-col>

        <v-col lg="3" align-self="center"> -->
          <v-btn :disabled="!title" color="success" class="mr-4" @click="submit">
            Добавить
          </v-btn>
        <!-- </v-col>

        <v-col lg="2" align-self="center"> -->
          <v-checkbox v-model="isUrgent" color="red" label="Срочно"></v-checkbox>
        <!-- </v-col>

      </v-row> -->
  </v-form>
</template>

<script>
  export default {
    name: 'newTask',
    data: () => ({
      title: '',
      isUrgent: false

    }),
    methods: {
      submit() {
        this.$store.dispatch("POST_TASK", {
            listid: this.$route.params.id,
            title: this.title,
            isComplete: false,
            isUrgent: this.isUrgent
          })
          .then(response => {
            // + окошко с вопросом 
            console.log(response, "submit done");
            this.title = ''
            this.isUrgent = false

          })
          .catch(error => console.log(error))
      },
      
    }
  }
</script>