<template>
  <div>
   <v-form @submit.prevent="submit(title)">
    <v-container>
      <v-row>
        <v-col cols="12" lg="6">
          <v-text-field v-model="title" solo label="Добавить новую задачу" placeholder="Название">
          </v-text-field>
        </v-col>

        <v-col cols="12" lg="6">
          <v-text-field v-model="tags" solo label="Тэг" placeholder="Тэги через запятую">
          </v-text-field>
        </v-col>

        <v-col cols="12" lg="3">
          <v-btn :disabled="!title" color="success" class="mr-4" @click="submit(title, tags)">
            <v-icon>add</v-icon> Добавить
          </v-btn>
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
      tags: [],
      error: '',
      rules: {
        required: value => !!value || "Required",
      },

      paramsModal: {
        open: false,
        titleTask: '',
        titleList: '',
        tags: []
      }
    }),
    components: {
      PopupAdd
    },
    methods: {
      async submit(title, tags) {
        console.log(title, tags)
        this.paramsModal.titleTask = title

        if (tags.length > 0) {
          this.paramsModal.tags = tags.split(", ")
          console.log(this.paramsModal.tags);
        }
        

        let t = await this.$store.dispatch('GET_LISTS')
        for (let i = 0; i < t.length; i++) {
          if (Object.values(t)[i].title == this.title) {
            console.log('got one')
            this.error = 'Задача с таким именем уже существует'
            this.paramsModal.open = false
          }
          else {
            this.paramsModal.open = true
          }
        }

      },
      async closePopup() {
        this.paramsModal.open = false
        try {
          if ( this.tags.length > 0) {
            await this.$store.dispatch("NEW_LIST_POST", { title: this.title.trim(), tags: this.tags.split(", ")})
          } else {
            await this.$store.dispatch("NEW_LIST_POST", { title: this.title.trim(), tags: []})
          }
          
          
        } catch (error) {
          this.error = 'Не удалось добавить задачу'
        }
        
        this.title = ''
        this.tags = []
        this.$store.commit("SET_NEW_LIST_FORM", false)
      }
    }
  }
</script>