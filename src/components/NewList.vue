<template>
  <v-container pt-0 pr-0 pb-0 pl-0>
    <v-form ref="form" @submit.prevent="submit()">
      <v-text-field ref="input" @blur="closeForm()" append-icon="add" solo v-model="title" placeholder="Название"
        :rules="[rules.required]"></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: 'newList',
    data: () => ({
      title: '',
      rules: {
        required: value => !!value || "Required",
      }
    }),
    methods: {
      submit() {
        // this.task.title.trim()
        this.$store.dispatch("POST_LIST", {
            title: this.title
          })
          .then(response => {
            // + окошко с вопросом ?
            console.log(response);
            this.title = ''
            this.$router.push({
              name: 'tasks',
              params: {
                id: response.data.id
              }

            })
            this.$store.commit("SET_NEW_LIST_FORM", false)
          })
      },
      
      closeForm() {
        this.$store.commit("SET_NEW_LIST_FORM", false)
      }
    },
    mounted() {
      this.$refs.input.focus()
    }
  }
</script>