<template>
  <div>
    <v-navigation-drawer permanent style="width: 100%;">
      <v-toolbar dark>
        <v-toolbar-title>Задачи</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="(list, i) in LISTS" :key="i" @click="toggle(i)" :style="{'background-color': list.completed == null? 'white' : list.completed ? 'green' : 'grey'}">
          <v-list-item-action>
            <v-btn icon @click.stop="openModal(list.title, list.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-list-item-content>
            <!-- {{i}} {{list.id}} -->
            <v-list-item-title >{{ list.title }} {{list.id}} {{list.completed}}</v-list-item-title>
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