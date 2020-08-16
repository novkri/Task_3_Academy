<template v-slot="dialogAdd">
  <v-container>
    <v-row>
      <v-dialog v-model="paramsModal" slot="dialogAdd">
        <v-card>
          <v-card-title v-if="!titleList">Задача добавлена</v-card-title>
           <v-card-title v-else>Подзадача добавлена</v-card-title> 
          <v-card-text>
            <v-container v-if="!titleList">
              Задача "{{titleTask}}" добавлена в список дел
            </v-container>
            <v-container v-else>
              Подзадача "{{titleTask}}" добавлена к задаче "{{titleList}}"
            </v-container>

              <v-btn @click="closePopup" color="success" dark>ok</v-btn>

          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'popup',
  props: ['titleTask', 'titleList'],
  data: () => ({
    paramsModal: {
      open: true,
    }
  }),
  methods: {
    closePopup() {
      this.$emit('closePopup')
    },

    // async deleteList(listId) {
    //   await this.$emit('deleteList', listId)
    //   this.$emit('closePopup')
    // }
  }
}
</script>
