<template>
  <div>
    <v-card style="height: 100%; overflow: hidden;">
      <!-- список -->
      <v-list two-line v-for="(task, index) in tasks" :key="index">
        <v-list-item @click.prevent="toggle(index)">
          <v-checkbox v-model="task.isComplete" color="success"></v-checkbox>

          <v-list-item-content>
            <!-- добавить зачеркивание -->
            <v-list-item-title>{{ task.title }}</v-list-item-title>
            <v-list-item-title>{{ task.subtitle }}</v-list-item-title>
          </v-list-item-content>

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

  export default {
    name: 'tasks',
    props: {
      listId: Number
    },
    components: {
      NewTask
    },
    data: () => ({
      tasks: [{
          id: 1,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: true
        },
        {
          id: 2,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: false
        }, {
          id: 3,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: true
        }, {
          id: 4,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: false
        }, {
          id: 5,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: true
        }, {
          id: 6,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: true
        }, {
          id: 7,
          title: 'task title',
          subtitle: "somw subtitle",
          isComplete: true
        },
      ]
    }),
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