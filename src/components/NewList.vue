<template>
<div>
  <v-container pt-0 pr-0 pb-0 pl-0>
    <v-row>
      <v-col lg10>
        <v-form ref="form" @submit.prevent="submit(title)">
          <!-- @keyup.enter="closeForm()" -->
          <v-text-field ref="input" append-icon="add" solo v-model="title" placeholder="Название"
            :rules="[rules.required]"></v-text-field>
        </v-form>
      </v-col>
      <v-col lg2><v-btn @click.prevent="submit(title)" :disabled="!title"><v-icon>add</v-icon> add</v-btn></v-col>
    </v-row>
  </v-container>

  <PopupAdd v-if="paramsAddModal.open" @closePopup="closePopup" v-model="paramsAddModal" :titleTask="paramsAddModal.titleTask" />

</div>
  
</template>

<script>
import PopupAdd from './Popups/PopupAdd'

  export default {
    name: 'newList',
    data: () => ({
      title: '',
      rules: {
        required: value => !!value || "Required",
      },

      paramsAddModal: {
        open: false,
        titleTask: '',
        titleList: ''
      }
    }),
    components: {
      PopupAdd
    },
    methods: {
      submit(title) {
        this.paramsAddModal.titleTask = title
        this.paramsAddModal.open = true
      },
      closePopup() {
        this.paramsAddModal.open = false
        this.$store.dispatch("POST_LIST", { title: this.title.trim()})
          .then(response => {

            this.title = ''

            this.$router.push({
              name: 'tasks',
              params: {
                id: response.data.id
              }
            })

          })
        this.$store.commit("SET_NEW_LIST_FORM", false)
      },
      closeForm() {
        // this.$store.commit("SET_NEW_LIST_FORM", false)
      }
    },
    mounted() {
      this.$refs.input.focus()
    }
  }
</script>