<template>
  <div>
    <v-card style="height: 100%; overflow: hidden;">

      <v-list two-line v-for="(task, index) in tasks" :key="index">
        <v-list-item>
          <v-checkbox v-model="task.isComplete" color="success" @click.prevent="toggle(task.id,task.isComplete)"></v-checkbox>

          <v-list-item-content>
            <!-- добавить зачеркивание here when checked? -->
            <v-list-item-title>{{ task.title }} taskid:{{index}} listid: {{task.listid}}</v-list-item-title>
             <!-- <v-list-item-title>{{ task.date }}</v-list-item-title> -->
          </v-list-item-content>

          <!-- <v-icon v-if="task.isUrgent" color="red">info</v-icon>
          <v-icon v-else></v-icon> -->
     

          <v-list-item-action>
            <v-btn icon @click.stop="openModal(task.title, task.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item-action>
          
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-row>
          <v-col>
            <NewTask />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <PopupDelete v-if="paramsModal.open" @closePopup="closePopup" v-model="paramsModal" :val="paramsModal.title"
      :listId="paramsModal.listId" @deleteList="deleteTask(paramsModal.taskId)" />

    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import NewTask from './NewTask'
  import PopupDelete from './Popups/PopupDelete'
  // import {mapGetters} from 'vuex'

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
      lists: [],
      tasks: [],
      paramsModal: {
        open: false,
        title: '',
        taskId: undefined,
        listId: ''
      },
    }),
    computed: {
      // ...mapGetters(['TASKS'])
    },
    async mounted () {
      this.lists = await this.$store.dispatch("GET_LISTS")


      console.log('mounted lists', this.lists[this.$route.params.id].id);
      const thisListId = this.lists[this.$route.params.id].id
      console.log('thisListId', thisListId);

      
      this.tasks = await this.$store.dispatch("GET_TASKS", thisListId) 
      
      console.log('mounted here', this.lists , this.tasks);
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
       completed() {
        this.$store.commit("SET_TASKS")
      },
      // for popup
      closePopup() {
        this.paramsModal.open = false
      },
      openModal(title, id) {
        console.log("openModal", this.paramsModal.listId );
        this.paramsModal.title = title 
        // this.paramsModal.listId = this.$route.params.id // сюда записался taskid
        this.paramsModal.taskId = id 
        // еще передавать title
        console.log("openModal", this.paramsModal);
        this.paramsModal.open = true
      },

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