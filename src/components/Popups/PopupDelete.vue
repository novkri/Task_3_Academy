<template>
  <v-container >
    <v-row >
      <v-dialog v-model="paramsModal" width="500">
        <v-card >
          <v-card-title v-if="taskId == undefined">Удалить задачу? <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn></v-card-title> 
          <v-card-title v-else>Удалить подзадачу? <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn></v-card-title> 

          <v-card-text>
            <v-container>
              Удалить дело "{{val}}"?
            </v-container>

            <v-card-actions>
              <v-row>
                <v-btn color="red" dark @click="deleteList">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="closePopup" color="success" dark>Нет</v-btn>
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
