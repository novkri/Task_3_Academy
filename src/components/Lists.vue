<template>
  <div>
    <v-navigation-drawer permanent style="width: 100%;">
      <v-toolbar dark>
        <v-toolbar-title>Задачи</v-toolbar-title>
      </v-toolbar>

      <!-- изменить внешний вид -->
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
            <v-list-item-content>
              <v-list-item-title>Имени</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- фильтры -->
        <!-- <v-list-action>
          <v-btn><v-icon>filter_list</v-icon>Фильтровать по</v-btn>
        </v-list-action> -->
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

      <!-- lists -->
      <v-list>
        <v-list-item v-for="(list, i) in LISTS" :key="i" @click="toggle(list.id)">
          <v-list-item-action>
            <v-btn icon @click.stop="openModal(list.title, list.id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ list.title }} {{i}} {{list.id}}</v-list-item-title>
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

    <!-- popup -->
    <!-- !! clean some parameters here !! -->
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
      paramsModal: {
        open: false,
        title: '',
        listId: undefined
      }
    }),
    async mounted() {
      console.log('mounted hook');
      // this.listsWithId = await this.$store.dispatch('GET_LISTS')
      // console.log(LISTS);
    },
    beforeUpdate() {
      console.log('before update');
    },
    updated() {
      console.log('updated');
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

      // redirect to list clicked
      // !!!!!!!!!!!!!!!! check it more
      toggle(idx) {
        console.log(this.$route.params.id, idx)
        this.$store.dispatch("GET_TASKS", idx)
        // if (this.$route.params.id !== idx) {
          // this.$router.push({
          //   name: 'tasks',
          //   params: {
          //     id: idx
          //   }
          // })
        // } else {
        //   console.log(this.$route.params.id, "=", idx);
        // }
      },

      openNewListForm() {
        this.$store.commit("SET_NEW_LIST_FORM", true)
      },

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
        this.$store.dispatch("FILTER_BY", { val });
      }
    }
  }
</script>