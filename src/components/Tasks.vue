<template>
  <div>
    <v-card style="height: 100%; overflow: hidden;">
      <!-- список -->
      <v-list two-line v-for="(task, index) in TASKS" :key="index">
        <v-list-item @click.prevent="toggle(index)">
          <v-checkbox v-model="task.isComplete" color="success"></v-checkbox>

          <v-list-item-content>
            <!-- добавить зачеркивание -->
            <v-list-item-title>{{ task.title }}</v-list-item-title>
          </v-list-item-content>

          <!-- срочное -->
          <v-icon v-if="task.isUrgent" color="red">info</v-icon>
          <v-icon v-else></v-icon>
     

          <!-- delete doesni work yet -->
          <v-list-item-action>
            <v-btn @click="deleteTask(task.id)" icon>
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
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import NewTask from './NewTask'
  import {mapGetters} from 'vuex'

  export default {
    name: 'tasks',
    props: {
      listId: Number
    },
    components: {
      NewTask
    },
    data: () => ({
    }),
    computed: {
      ...mapGetters(['TASKS'])
    },
    async mounted () {
      await this.$store.dispatch("GET_TASKS", this.$route.params.id)
    },
    methods: {
      toggle(index) {

        console.log(index)

      },
      openModal() {
        this.$router.push({
          // name: '',
          // params: {
          //   taskId: this.task.id
          // }
        })
      }
    }
  }
</script>