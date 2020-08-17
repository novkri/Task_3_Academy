<template>
  <div>
    <v-card style="height: 100%; overflow: hidden;">

      <v-list two-line v-for="(task, index) in TASKS" :key="index">
        <v-list-item>
          <v-checkbox v-model="task.isComplete" color="success" @click="toggle(index, task.isComplete, task.title)"></v-checkbox>

          <v-list-item-content>
            <v-list-item-title>{{ task.title }} {{task.date}} </v-list-item-title>
             <v-list-item-title>{{ task.date }}</v-list-item-title>
          </v-list-item-content>

          <v-icon v-if="task.isUrgent" color="red">warning</v-icon>
          <v-icon v-else></v-icon>
     

          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{on}">
                <v-btn icon @click.stop="openModal(task.title, task.listid, index)" v-on="on">
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Удалить</span>
            </v-tooltip>
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
      :listId="paramsModal.listId" :taskId="paramsModal.taskId" @deleteList="deleteList(paramsModal.taskId)" />

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
      lists: [],
      tasks: [],
      isCompleted: [],
      paramsModal: {
        open: false,
        title: '',
        taskId: undefined,
        listId: ''
      },
    }),
    watch: {
      ...mapGetters(['TASKS']),
      tasks: function() {
        console.log('done', this.$store.getters.TASKS);
      }
    },

    computed: {
      ...mapGetters(['TASKS']),
      
    },
    async mounted () {
      this.lists = await this.$store.dispatch("GET_LISTS")
      const thisListId = this.lists[this.$route.params.id].id
      this.tasks = await this.$store.dispatch("GET_TASKS", thisListId)
      console.log(this.tasks, thisListId);
    },
    methods: {
      async toggle(index, complete, title) {
        console.log(index);
        const thisListId = this.lists[this.$route.params.id].id
        console.log('thisListId', thisListId);
        this.$store.dispatch("TOGGLE_TASK", {
          thisListId,
          taskId: index,
          isComplete: complete,
          title
        })
        for (let i = 0; i < this.tasks.length; i++) {
          console.log(this.tasks[i].isComplete)
          this.isCompleted.push(this.tasks[i].isComplete)
        }
        
      },

      closePopup() {
        this.paramsModal.open = false
      },
      openModal(title, listid, id) {
        console.log(id);
        this.paramsModal.title = title 
        this.paramsModal.taskId = id 
        this.paramsModal.listId = listid
        this.paramsModal.open = true
      },

      async deleteList(index) {
        console.log('delete',this.$route.params.id, index)
        this.paramsModal.open = false
        try {
          await this.$store.dispatch("DELETE_TASK", {thisListId: this.$route.params.id, index})
        } catch (error) {
          console.log(error);
        }
      }
  
    }
  }
</script>