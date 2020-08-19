<template>
  <div>
    <v-form @submit.prevent="submit(title)">
      <v-container>
        <v-row>
          <v-col cols="12" lg="7">
            <v-text-field v-model="title" solo label="Добавить новую подзадачу" append-icon="add"
              placeholder="Название">
            </v-text-field>
          </v-col>

          <v-col cols="12" lg="3">
            <v-btn :disabled="!title" color="success" class="mr-4" @click="submit(title)">
              <v-icon>add</v-icon> Добавить
            </v-btn>
          </v-col>

          <v-col cols="12" lg="2">
            <v-checkbox v-model="isUrgent" color="red" label="Срочно" style="margin: 0;"></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-snackbar v-model="error" v-if="error">
      {{ error }} 
    </v-snackbar>

    <PopupAdd v-if="paramsModal.open" @closePopup="closePopup" v-model="paramsModal"
      :titleTask="paramsModal.titleTask" :titleList="paramsModal.titleList" :listId="paramsModal.listId"/>

  </div>
</template>

<script>
  import PopupAdd from './Popups/PopupAdd'
import { mapGetters } from 'vuex';

  export default {
    name: 'newTask',
    data: () => ({
      title: '',
      isUrgent: false,
      error: '',
      paramsModal: {
        open: false,
        titleTask: '',
        titleList: '',
        listId: ''
      }
    }),
    components: {
      PopupAdd
    },
      computed: {
        ...mapGetters(['LISTS']),
    },
    
    methods: {
      async submit(title) {
        this.lists = await this.$store.dispatch("GET_LISTS")
      
        this.paramsModal.listId = this.lists[this.$route.params.id].id
        this.paramsModal.titleTask = title
        this.paramsModal.titleList = this.lists[this.$route.params.id].title

        let t = await this.$store.dispatch('GET_TASKS', this.paramsModal.listId)
        for (let i = 0; i < t.length; i++) {
          if (Object.values(t)[i].title == this.title) {
            console.log('got one')
            this.error = 'Подзадача с таким именем уже существует'
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
          await this.$store.dispatch("NEW_POST_TASK", {
            listid: this.paramsModal.listId,
            title: this.title,
            isUrgent: this.isUrgent,
            isComplete: false,
            date: new Date().toLocaleString([], {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          })
        } catch (error) {
          this.error = 'Не удалось добавить задачу'
        }
        
        await this.$store.dispatch('GET_LISTS')
        this.title = ''
        this.isUrgent = false
      }
    }
  }
</script>