<template>
  <div>
    <v-card style="height: 100%; overflow: hidden;">
      <!-- list of tasks -->
      <v-list two-line v-for="(task, index) in TASKS" :key="index">
        <v-list-item>
          <v-checkbox v-model="task.isComplete" color="success" @click.prevent="toggle(task.id,task.isComplete)"></v-checkbox>

          <v-list-item-content>
            <!-- добавить зачеркивание here when checked? -->
            <v-list-item-title>{{ task.title }}</v-list-item-title>
             <v-list-item-title>{{ task.date }}</v-list-item-title>
          </v-list-item-content>

          <!-- checkbox -->
          <v-icon v-if="task.isUrgent" color="red">info</v-icon>
          <v-icon v-else></v-icon>
     

          <!-- delete -->
          <v-list-item-action>
            <v-btn icon @click.stop="openModal(task.title, task.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item-action>
          
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- добавить новую подзадачу -->
      <v-card-actions>
        <v-row>
          <v-col>
            <NewTask />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <PopupDelete v-if="paramsModal.open" @closePopup="closePopup" v-model="paramsModal" :val="paramsModal.title"
      :listId="paramsModal.taskId" @deleteList="deleteTask(paramsModal.taskId)" />

    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import NewTask from './NewTask'
  import PopupDelete from './Popups/PopupDelete'
  import {mapGetters} from 'vuex'

  export default {
    name: 'tasks',
    props: {
      listId: Number,
    },
    components: {
      NewTask,
      PopupDelete,
    },
    data: () => ({
      paramsModal: {
        open: false,
        title: '',
        taskId: undefined
      },
      // paramsAddModal: {
      //   open: false,
      //   titleTask: '',
      //   titleList: ''
      // }
    }),
    computed: {
      ...mapGetters(['TASKS'])
    },
    async mounted () {
      await this.$store.dispatch("GET_TASKS", this.$route.params.id)
    },
    methods: {
      toggle(index, complete) {

        console.log(index, complete)
        this.$store.dispatch("TOGGLE_TASK", {
        taskId: index,
        isComplete: complete,
        listId: this.$route.params.id
      });
  
      },
      //  completed() {
      //   // this.$store.commit("SET_TASKS")
      // },
      // for popup
      closePopup() {
        this.paramsModal.open = false
      },
      openModal(title, id) {
        this.paramsModal.title = title //сюда записался listId
        this.paramsModal.listId = this.$route.params.id // сюда записался taskid
        this.paramsModal.taskId = id 
        // еще передавать title
        console.log("openModal", this.paramsModal);
        this.paramsModal.open = true
      },
      // openAddModal(title, id) {
      //   this.paramsAddModal.titleTask = title //сюда записался listId
      //   this.paramsAddModal.titleList = this.$route.params.id // сюда записался taskid
      //   // еще передавать title
      //   console.log("paramsAddModal", this.paramsAddModal, id);
      //   this.paramsAddModal.open = true
      // },


      async deleteTask(index) {
        console.log(index);
        await this.$store.dispatch("DELETE_TASK", { listid: this.$route.params.id, index})
          .then(response => {
            // + перенаправлнеи на lists/ ?
            // this.$router.push({
            //   name: 'task',
            //   params: {taskId: this.$route.params.id}
            // })
            console.log(response, "DELETE_TASK done");
          })
          .catch(error => console.log(error))
      }
    }
  }
</script>