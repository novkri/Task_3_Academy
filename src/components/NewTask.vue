<template>
  <v-form @submit.prevent="submit()">
    <v-text-field  v-model="title" solo label="Добавить новую подзадачу" append-icon="add" @blur="closeForm()" placeholder="Название" :rules="[rules.required]"></v-text-field>
  </v-form>
</template>

<script>
export default {
  name: 'newTask',
  data: () => ({
    title: '',
    rules: {
      required: value => !!value || "Required",
    }
  }),
  methods: {
     submit () {
       console.log("submit start");
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
            // this.$store.commit("SET_NEW_LIST_FORM", false)
          
    },
    closeForm () {
      console.log("closeForm");
    }
  },
}
</script>
