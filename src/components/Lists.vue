<template>
  <div>
    <v-navigation-drawer permanent style="width: 100%;">
      <v-toolbar dark>
        <v-toolbar-title>Задачи</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- <v-btn @click.prevent="sort"><v-icon>sort</v-icon>Сортировать по имени</v-btn> -->

      <v-list>
        <v-list-group v-model="sortItem.active" prepend-icon="sort" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Сортировать по</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="sort" active-class>
            <v-list-item-content>
              <v-list-item-title>Имени</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

<!-- v-for="(item, idx) in filterItem" :key="idx" -->
        <v-list-group v-model="filterItem.active" prepend-icon="filter_list" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Фильтровать по</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-for="(subFilter, idx) in filters" :key="idx" active-class @click="filter(subFilter.by)">
            <v-list-item-content>
              <v-list-item-title>{{ subFilter.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

<!--  v-colored="list.completed" -->
        <v-list-item v-for="(list, i) in LISTS" :key="i" @click="toggle(i)"
        :style="{'background-color': list.completed == null ? 'white' : list.completed ? '#AED581' : '#E0E0E0'}" v-model="listsWithId.completed">
          <v-list-item-action>
            <v-tooltip bottom>
              <template v-slot:activator="{on}">
                <v-btn icon @click.stop="openModal(list.title, list.id)" v-on="on">
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Удалить задачу</span>
            </v-tooltip>
            
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title >{{ list.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-row>
          <v-col>
            <NewList />
          </v-col>
        </v-row>
      </v-card-actions>


    </v-navigation-drawer>

    <v-snackbar v-model="error" v-if="error">
      {{ error }} 
    </v-snackbar>

    <PopupDelete v-if="paramsModal.open" @closePopup="closePopup" v-model="paramsModal" :val="paramsModal.title"
      :listId="paramsModal.listId" @deleteList="deleteList(paramsModal.listId)" />
  </div>

</template>

<script>
  import NewList from './NewList'
  import PopupDelete from './Popups/PopupDelete'
  import { mapGetters } from 'vuex'

  export default {
    name: 'lists',
    components: {
      NewList,
      PopupDelete
    },
    data: () => ({
      listsWithId: [],
      isCompleted: [],
      tasks: [],
      error: '',
      paramsModal: {
        open: false,
        title: '',
        listId: undefined
      },

      sortItem: {
        active: false,
      },
      filters: [{
              title: "Незавершенные",
              by: "remaining"
            },
            {
              title: "Завершенные",
              by: "completed"
            },
            {
              title: "Все",
              by: "all"
            }
          ],
      filterItem: {
        active: false,
      }
    }),
    // mounted
    async created() {
      try {
        this.listsWithId = await this.$store.dispatch('GET_LISTS')
      } catch (error) {
        console.log(error)
      }
    },
    // watch: {
    //   ...mapGetters(['LISTS']),
    //   listsWithId: function() {
    //     console.log('done', this.$store.getters.LISTS);
    //   }
    // },
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
 
    methods: {
      sort() {
        this.$store.commit('SORT')
      },
      async filter(value) {
        this.listsWithId = await this.$store.dispatch('GET_LISTS')
        if (value == "completed") {
          let newLists = this.listsWithId.filter(list => list.completed === true)
          this.$store.commit("SET_LISTS", newLists )
        } else if (value == "remaining") {
          let newLists = this.listsWithId.filter(list => list.completed === false)
          this.$store.commit("SET_LISTS", newLists )
        } else {
          this.$store.commit("SET_LISTS", this.listsWithId )
        }
        return this.listsWithId 
      },
      async closePopup() {
        this.paramsModal.open = false
        this.listsWithId = await this.$store.dispatch('GET_LISTS')

      },
      openModal(title, id) {
        this.paramsModal.title = title
        this.paramsModal.listId = id
        this.paramsModal.open = true
      },

      async toggle(idx) {
        if (idx !== this.$route.params.id) {
          await this.$store.dispatch("GET_TASKS", idx)
          this.$router.push({
          name: 'tasks',
          params: {
            id: idx
          }
        })
        .catch(err => {
          if (
            err.name !== 'NavigationDuplicated' &&
            !err.message.includes('Avoided redundant navigation to current location')
          ) {
            console.error(err)
          }
        })
        }
      },

      openNewListForm() {
        this.$store.commit("SET_NEW_LIST_FORM", true)
      },

      async deleteList(index) {
        console.log('delete', index)
        this.paramsModal.open = false
        try {
          await this.$store.dispatch("DELETE_LIST", {index})
        } catch (error) {
          this.error = 'Не удалось удалить задачу'
        }
      },
    }
  }
</script>