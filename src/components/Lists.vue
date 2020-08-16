<template>
  <div>
    <v-navigation-drawer permanent style="width: 100%;">
      <v-toolbar dark>
        <v-toolbar-title>Задачи</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-group v-model="sortItem.active" prepend-icon="sort" no-action>
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>Сортировать по</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click.prevent="sort" active-class> <!-- "sort(sortItem.by)" -->
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


        <v-list-item v-for="(list, i) in LISTS" :key="i" @click="toggle(i)" :style="{'background-color': list.completed == null? 'white' : list.completed ? 'green' : 'grey'}">
          <v-list-item-action>
            <v-btn icon @click.stop="openModal(list.title, list.id)">
              <v-icon>delete</v-icon>
            </v-btn>
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
      paramsModal: {
        open: false,
        title: '',
        listId: undefined
      },

      sortItem: {
        active: true,
        // by: "name"
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
        // items: 
      }
    }),
    async mounted() {
      console.log('mounted hook');
      this.listsWithId = await this.$store.dispatch('GET_LISTS')
    },

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
        // value
        return this.listsWithId.sort(function (a, b) {return (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1;})
      },
      filter(value) {
        if (value == "completed") {
          let newLists = this.listsWithId.filter(list => list.completed === true)
          this.$store.commit("SET_LISTS", newLists )
          newLists = []
        } else if (value == "remaining") {
          let newLists = this.listsWithId.filter(list => list.completed === false)
          this.$store.commit("SET_LISTS", newLists )
          newLists = []
        } else {
          this.$store.commit("SET_LISTS", this.listsWithId )
        }
        return this.listsWithId 
      },
      closePopup() {
        this.paramsModal.open = false
      },
      openModal(title, id) {
        this.paramsModal.title = title
        this.paramsModal.listId = id
        this.paramsModal.open = true
      },

      async toggle(idx) {
        console.log("toggle",idx)
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
      },

      openNewListForm() {
        this.$store.commit("SET_NEW_LIST_FORM", true)
      },

      // async deleteList(index) {
      //   await this.$store.dispatch("DELETE_LIST", index)
      //     .then(response => {
      //         console.log(response, "DELETE_LIST done");
      //       })
      //     .catch(error => console.log(error))
      // },
    }
  }
</script>