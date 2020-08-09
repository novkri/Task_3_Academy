<template>
<div>
   <v-form @submit.prevent="submit(title)">

    <v-text-field v-model="title" solo label="Добавить новую подзадачу" append-icon="add" placeholder="Название">
    </v-text-field>

    <v-btn :disabled="!title" color="success" class="mr-4" @click="submit(title)">
      Добавить
    </v-btn>

    <v-checkbox v-model="isUrgent" color="red" label="Срочно"></v-checkbox>
    
  </v-form>
  <PopupAdd v-if="paramsAddModal.open" @closePopup="closePopup" v-model="paramsAddModal" :titleTask="paramsAddModal.titleTask" :titleList="paramsAddModal.titleList"/>
</div>
 
  
</template>

<script>
  import PopupAdd from './Popups/PopupAdd'

  export default {
    name: 'newTask',
    data: () => ({
      title: '',
      isUrgent: false,

      paramsAddModal: {
        open: false,
        titleTask: '',
        titleList: ''
      }
    }),
    components: {
      PopupAdd
    },
    //   computed: {
    //     canCreate() {
    //       return this.task.title.trim()
    //     }
    // },
    methods: {
      submit(title) {
        this.paramsAddModal.titleTask = title 
        this.paramsAddModal.titleList = this.$route.params.id, 
        // еще передавать title list
        console.log("paramsAddModal", this.paramsAddModal);
        this.paramsAddModal.open = true
      },

      closePopup() {
        this.paramsAddModal.open = false

        this.$store.dispatch("POST_TASK", {
            listid: this.$route.params.id,
            title: this.title.trim(),
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
            console.log(response);
            this.title = ''
            this.isUrgent = false
          })
          .catch(error => console.log(error))
      },
    }
  }
</script>