<template>
  <div>
    <v-toolbar dark>
        <v-toolbar-title>Подзадачи в {{ thisListTitle }} </v-toolbar-title>
      </v-toolbar>

    <v-card style="height: 100%; overflow: hidden;">
      <v-list>
        <v-list-item>
          <v-text-field v-model="search" solo label="search" append-icon="clear" @click:append="clearSearch" 
            placeholder="Поиск по названию" @keyup.enter="searchTask(search)">
          </v-text-field>
        </v-list-item>
      </v-list>

      <v-list two-line v-for="(task, index) in TASKS" :key="index">

        <v-list-item>

          <v-checkbox v-model="task.isComplete" color="success" @click="toggle(index, task.isComplete, task.title)"></v-checkbox>

          <v-list-item-content>
            <v-list-item-title>{{ task.title }}</v-list-item-title>
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

    <v-snackbar v-model="error" v-if="error">
      {{ error }} 
    </v-snackbar>

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
      search: '',
      isCompleted: [],
      error: '',
      thisListTitle: '',
      paramsModal: {
        open: false,
        title: '',
        taskId: undefined,
        listId: ''
      },
    }),

    computed: {
      ...mapGetters(['TASKS']), 
    },
    // mounted
    async created () {
      this.lists = await this.$store.dispatch("GET_LISTS")
      const thisListId = this.lists[this.$route.params.id].id
      this.tasks = await this.$store.dispatch("GET_TASKS", thisListId)
      this.thisListTitle = this.lists[this.$route.params.id].title
    },
    methods: {
      async searchTask(title) {
        let newTask = this.tasks.filter(task => task.title.includes(title))
        console.log(title, newTask);
        this.$store.commit("SET_TASKS", newTask)
        
      },
      clearSearch() {
        this.search = ''
        this.$store.commit("SET_TASKS", this.tasks )
      },

      async toggle(index, complete, title) {
        const thisListId = this.lists[this.$route.params.id].id
        try {
          await this.$store.dispatch("TOGGLE_TASK", {
            thisListId,
            taskId: index,
            isComplete: complete,
            title
          })
          for (let i = 0; i < this.tasks.length; i++) {
            console.log(this.tasks[i].isComplete)
            this.isCompleted.push(this.tasks[i].isComplete)
          }
        } catch (error) {
          this.error = 'Неудалось отметить подзадачу'
        }
        
        await this.$store.dispatch('GET_LISTS')
      },

      closePopup() {
        this.paramsModal.open = false
      },
      openModal(title, listid, id) {
        this.paramsModal.title = title 
        this.paramsModal.taskId = id 
        this.paramsModal.listId = listid
        this.paramsModal.open = true
        console.log(this.paramsModal);
      },

      async deleteList(index) {
        console.log('delete',this.$route.params.id, index)
        this.paramsModal.open = false
        try {
          await this.$store.dispatch("DELETE_TASK", {thisListId: this.$route.params.id, index})
        } catch (error) {
          this.error = 'Неудалось удалить подзадачу'
        }
        await this.$store.dispatch('GET_LISTS')
      }
  
    }
  }
</script>