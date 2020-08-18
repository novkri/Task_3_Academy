<template>
  <div>
   <v-form @submit.prevent="submit(title)">
    <v-container>
      <v-row>
        <v-col cols="12" lg="7">
          <v-text-field v-model="title" solo label="Добавить новую задачу" append-icon="add" placeholder="Название">
          </v-text-field>
        </v-col>

        <v-col cols="12" lg="3">
          <v-btn :disabled="!title" color="success" class="mr-4" @click="submit(title)">
            <v-icon>add</v-icon> Добавить
          </v-btn>
        </v-col>

        <v-col cols="12" lg="2">
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <v-snackbar v-model="error" v-if="error">
    {{ error }} 
  </v-snackbar>

  <PopupAdd v-if="paramsModal.open" @closePopup="closePopup" v-model="paramsModal" :titleTask="paramsModal.titleTask" :titleList="paramsModal.titleList"/>
</div>
</template>

<script>
import PopupAdd from './Popups/PopupAdd'

  export default {
    name: 'newList',
    data: () => ({
      title: '',
      error: '',
      rules: {
        required: value => !!value || "Required",
      },

      paramsModal: {
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
        this.paramsModal.titleTask = title
        this.paramsModal.open = true
      },
      async closePopup() {
        this.paramsModal.open = false
        try {
          await this.$store.dispatch("NEW_LIST_POST", { title: this.title.trim()})
          
        } catch (error) {
          this.error = 'Не удалось добавить задачу'
        }
        
        this.title = ''
        this.$store.commit("SET_NEW_LIST_FORM", false)
      }
    }
  }
</script>