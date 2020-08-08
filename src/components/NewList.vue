<template>
  <v-container pt-0 pr-0 pb-0 pl-0>
    <v-row>
      <v-col lg10>
        <v-form ref="form" @submit.prevent="submit()">
          <v-text-field ref="input" append-icon="add" solo v-model="title" placeholder="Название" @keyup.enter="closeForm()"
            :rules="[rules.required]"></v-text-field>
        </v-form>
      </v-col>
      <v-col lg2><v-btn @click.prevent="submit()" :disabled="!title"><v-icon>add</v-icon> add</v-btn></v-col>
    </v-row>
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
        this.$store.dispatch("POST_LIST", { title: this.title.trim()})
          .then(response => {
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