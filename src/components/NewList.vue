<template>
  <div>
   <v-form @submit.prevent="submit(title)">
    <v-container>
      <v-row>
        <v-col cols="12" lg="7">
          <v-text-field v-model="title" solo label="Добавить новую задачу" append-icon="add" placeholder="Название">
          </v-text-field>
        </v-col>

        <v-col cols="12" lg="3">
          <v-btn :disabled="!title" color="success" class="mr-4" @click="submit(title)">
            <v-icon>add</v-icon> Добавить
          </v-btn>
        </v-col>

        <v-col cols="12" lg="2">
          <!-- v-model="isUrgent" -->
          <!-- <v-checkbox color="red" label="Срочно"></v-checkbox> -->
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <PopupAdd v-if="paramsAddModal.open" @closePopup="closePopup" v-model="paramsAddModal" :titleTask="paramsAddModal.titleTask" :titleList="paramsAddModal.titleList"/>
</div>
</template>

<script>
import PopupAdd from './Popups/PopupAdd'

  export default {
    name: 'newList',
    data: () => ({
      title: '',
      rules: {
        required: value => !!value || "Required",
      },

      paramsAddModal: {
        open: false,
        titleTask: '',
        titleList: ''
      }
    }),
    components: {
      PopupAdd
    },
    methods: {
      submit(title) {
        this.paramsAddModal.titleTask = title
        this.paramsAddModal.open = true
      },
      async closePopup() {
        this.paramsAddModal.open = false
        const list = await this.$store.dispatch("NEW_LIST_POST", { title: this.title.trim()})
        this.title = ''

        this.$store.commit("SET_NEW_LIST_FORM", false)
      }
    }
  }
</script>