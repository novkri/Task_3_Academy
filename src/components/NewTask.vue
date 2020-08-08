<template>
  <v-form @submit.prevent="submit()">

    <v-text-field v-model="title" solo label="Добавить новую подзадачу" append-icon="add" placeholder="Название">
    </v-text-field>

    <v-btn :disabled="!title" color="success" class="mr-4" @click="submit">
      Добавить
    </v-btn>

    <v-checkbox v-model="isUrgent" color="red" label="Срочно"></v-checkbox>
  </v-form>
</template>

<script>
  export default {
    name: 'newTask',
    data: () => ({
      title: '',
      isUrgent: false

    }),
    //   computed: {
    //     canCreate() {
    //       return this.task.title.trim()
    //     }
    // },
    methods: {
      submit() {
        this.$store.dispatch("POST_TASK", {
            listid: this.$route.params.id,
            title: this.title,
            isComplete: false,
            isUrgent: this.isUrgent,
            date: new Date().toLocaleString([], {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          })
          .then(response => {
            console.log(response, "submit done");
            this.title = ''
            this.isUrgent = false
          })
          .catch(error => console.log(error))
      },

    }
  }
</script>