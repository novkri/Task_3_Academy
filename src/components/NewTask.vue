<template>
  <v-form @submit.prevent="submit()">
    <v-text-field v-model="title" solo label="Добавить новую подзадачу" append-icon="add" placeholder="Название">
    </v-text-field>
  </v-form>
</template>

<script>
  export default {
    name: 'newTask',
    data: () => ({
      title: '',

    }),
    methods: {
      submit() {
        this.$store.dispatch("POST_TASK", {
            listid: this.$route.params.id,
            title: this.title,
            subtitle: '',
            isComplete: false
          })
          .then(response => {
            // + окошко с вопросом 
            console.log(response, "submit done");
            this.title = ''

          })
          .catch(error => console.log(error))
      },
    },
  }
</script>