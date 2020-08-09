<template>
  <div>
    <v-navigation-drawer permanent style="width: 100%;">
      <v-toolbar dark>
        <v-toolbar-title>Задачи</v-toolbar-title>
      </v-toolbar>


<!--  items: [{
          action: "sort",
          title: "Сортировать по",
          active: false,
          items: [{
            title: "имени",
            by: "name"
          }, ]
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
      ] -->
      <!-- сортировка -->
      <v-list dense>
        <v-list-group no-action>
          <v-list-item slot="activator">

            <v-list-item-icon>
              <v-icon>sort</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title >Сортировать по</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="sortBy('title')">
            <!-- v-for="(subitem, i) in item.items" :key="i" active-class
            v-on="item.action === 'sort' ? { click: () => sort(subitem.by) } : { click: () => filter(subitem.by)}" -->
            <v-list-item-content>
              <v-list-item-title>Имени</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- фильтры -->
        <v-list-group no-action>
          <v-list-item slot="activator">
          <v-list-item-icon>
              <v-icon>filter_list</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title >Фильтровать по</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="filterBy('all')">
            <!-- v-for="(subitem, i) in item.items" :key="i" active-class
            v-on="item.action === 'sort' ? { click: () => sort(subitem.by) } : { click: () => filter(subitem.by)}" -->
            <v-list-item-content>
              <v-list-item-title>Все</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="filterBy('completed')">
            <v-list-item-content>
              <v-list-item-title>Завершенные</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="filterBy('remaining')">
            <v-list-item-content>
              <v-list-item-title>Незавершенные</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>
      </v-list>

      <v-divider></v-divider>

      <!-- список задач -->
      <v-list>
        <v-list-item v-for="(list, i) in LISTS" :key="i" @click.prevent="toggle(list.id)">
          <v-list-item-action>
            <v-btn icon @click.stop="openModal(list.title, list.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ list.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- для новой задачи -->
      <v-list>
        <v-list-item @click.prevent="openNewListForm()" v-if="!isOpen">
          <v-list-item-content>
            <v-list-item-title>Добавить задачу (click here)</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-title>
              <v-icon>add</v-icon> <!-- !! ADD BTN SOMEWHERE HERE!! -->
            </v-list-item-title>
          </v-list-item-action>
        </v-list-item>

        <v-list-item v-if="openNewListFormValue">
          <NewList />
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <!-- popup -->
    <!-- !! clean some parameters here !! -->
    <Popup v-if="paramsModal.open" @closePopup="closePopup" v-model="paramsModal" :val="paramsModal.title"
      :listId="paramsModal.listId" @deleteList="deleteList(paramsModal.listId)" />
  </div>

</template>

<script>
  import NewList from './NewList'
  import Popup from './Popup'
  import { mapGetters } from 'vuex'

  export default {
    name: 'lists',
    components: {
      NewList,
      Popup
    },
    data: () => ({
      paramsModal: {
        open: false,
        title: '',
        listId: undefined
      },
      items: [{
          action: "sort",
          title: "Сортировать по",
          active: false,
          items: [{
            title: "имени",
            by: "name"
          }, ]
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
      },
    },
    async mounted() {
      await this.$store.dispatch("GET_LISTS")
    },
    methods: {
      // for popup
      closePopup() {
        this.paramsModal.open = false
      },
      openModal(title, id) {
        this.paramsModal.title = title
        this.paramsModal.listId = id
        console.log(this.paramsModal);
        this.paramsModal.open = true
      },

      // redirect to list clicked
      // !!!!!!!!!!!!!!!! check it more
      toggle(idx) {
        console.log(this.$route.params.id, idx);
        if (this.$route.params.id !== idx) {
          this.$router.push({
            name: 'tasks',
            params: {
              id: idx
            }
          })
        } else {
          console.log(this.$route.params.id, "=", idx);
        }
      },

      openNewListForm() {
        this.$store.commit("SET_NEW_LIST_FORM", true)
      },
      // sort(value) {
      //   console.log(value)
      // },
      // filter(value) {
      //   console.log(value)
      // },

      async deleteList(index) {
        await this.$store.dispatch("DELETE_LIST", index)
          .then(response => {
              // + перенаправлнеи на lists here maybe??? 
              // this.$router.push({
              //   name: 'todo'
              // })
              console.log(response, "DELETE_LIST done");
            })
          .catch(error => console.log(error))
      },

      sortBy(val) {
        this.$store.dispatch("SORT_BY", { val });
      },
      filterBy(val) {
        console.log('clicked')
        this.$store.dispatch("FILTER_BY", { val });
      }
    }
  }
</script>