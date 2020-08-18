<template>
  <v-container >
    <v-row >
      <v-dialog v-model="paramsModal" width="500">
        <v-card >
          <!-- clean title here -->
          <v-card-title>Title: {{val}} <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn></v-card-title> 
          <!-- + title for lists -->
          <!-- <v-card-title v-if="!titleList">Задача добавлена <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn></v-card-title>
          <v-card-title v-else>Подзадача добавлена <v-spacer></v-spacer> &times;</v-card-title> -->

          <v-card-text>
            <v-container>
              Удалить дело "{{val}}"? {{taskId}}, {{listId}}
            </v-container>

            <v-card-actions>
              <v-row>
                <v-btn color="red" dark @click="deleteList">da</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="closePopup" color="success" dark>net</v-btn>
              </v-row>
            </v-card-actions>
            

          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'popup',
  props: ['val', 'listId', 'taskId'],
  data: () => ({
    paramsModal: {
      open: true,
    }
  }),
  methods: {
    closePopup() {
      this.$emit('closePopup')
      this.paramsModal.open = false
    },

    async deleteList(taskId) {
      await this.$emit('deleteList', taskId)
      this.$emit('closePopup')
    }
  }
}
</script>
