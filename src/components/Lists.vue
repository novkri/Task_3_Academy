<template>
  <v-navigation-drawer permanent style="width: 100%;">
    <v-toolbar dark>
      <v-toolbar-title>Задачи</v-toolbar-title>
    </v-toolbar>
  
    <!-- фильтры и сортировка -->

        <v-list dense>
          <v-list-group v-model="item.active" v-for="(item, i) in items" :key="i" no-action>
            <v-list-item slot="activator">
              <v-list-item-icon>
                <v-icon v-text="item.action"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-for="(subitem, i) in item.items" :key="i" active-class
              v-on="item.action === 'sort' ? { click: () => sort(subitem.by) } : { click: () => filter(subitem.by)}">
              <v-list-item-content>
                <v-list-item-title>{{ subitem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>

    <v-divider></v-divider>

    <!-- задачи -->
    <v-list>
      <v-list-item :to="{ name: 'tasks', params: { id: list.id} }" v-for="(list, i) in LISTS" :key="i">
        <!-- delete doesni work yet -->
        <v-list-item-action>
          <v-btn @click="deleteList(list.id)" icon>
            <v-icon>delete</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ list.title }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-title>{{ countTasks(list.id) }}</v-list-item-title>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!-- создать нвоое задачу -->
    <v-list>
      <v-list-item @click.prevent="openNewListForm()" v-if="!isOpen">
        <v-list-item-content>
          <v-list-item-title>Добавить задачу</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-list-item-title>
            <v-icon>add</v-icon>
          </v-list-item-title>
        </v-list-item-action>
      </v-list-item>

      <v-list-item v-if="openNewListFormValue">
        <NewList />
      </v-list-item>
    </v-list>

    <!-- удалить задачу -->
        <!-- <v-list-item @click="deleteList()">  это метода еще нет deleteList -->
          <!-- <v-list-item-content>
            <v-list-item-title color="danger">
              Удалить Задание (не работает)
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list> --> 
  </v-navigation-drawer>
</template>

<script>
  import NewList from './NewList'
  import {mapGetters} from 'vuex'
 
  export default {
    name: 'lists',
    components: {
      NewList
    },
    data: () => ({
      items: [{
          action: "sort",
          title: "Сортировать по",
          active: false,
          items: [
            {
              title: "имени",
              by: "name"
            },
          ]
        },
        {
          action: "filter_list",
          title: "Фильтровать по",
          active: false,
          items: [{
              title: "Незваершенные",
              by: "remaining"
            },
            {
              title: "Звершенные",
              by: "completed"
            },
            {
              title: "Все",
              by: "all"
            }
          ]
        }
      ]
    }),
    computed: {
      ...mapGetters(['LISTS']),
      openNewListFormValue: {
        get() {
          return this.$store.getters.NEW_LIST_FORM
        },
        set(value) {
          this.$store.commit("SET_NEW_LIST_FORM", value)
        }
      },
      isOpen() {
        return this.$store.getters.NEW_LIST_FORM
      }
    },
    mounted () {
      this.$store.dispatch("GET_LISTS")
    },
    methods: {
      openNewListForm() {
        this.$store.commit("SET_NEW_LIST_FORM", true)
      },
      sort(value) {
        console.log(value)
      },
      filter(value) {
        console.log(value)
      },

      countTasks(index) {
        if (this.$store.getters.COUNT_TASKS(index) == undefined) {
          return 0
        } else {
          return this.$store.getters.COUNT_TASKS(index)
        }
        
      }
    }
  }
</script>