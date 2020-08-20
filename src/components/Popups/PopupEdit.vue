<template>
  <v-container >
    <v-row >
      <v-dialog v-model="paramsModal" width="500">
          <v-card>
            <v-card-title>
                Изменить задачу {{val}} <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-row>
                <v-col>
                    <v-text-field :data="commitData" v-model="title" solo label="Добавить новую задачу" append-icon="add" placeholder="Новое название" @keyup.enter="editList()">
                    </v-text-field>
                </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
                <v-row>
                <v-btn color="red" dark @click.prevent="editList()">Изменить</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="closePopup">Отмена</v-btn>
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
    title: '',
    paramsModal: {
      open: true,
    }
  }),
   computed:{
    commitData(){
      const title = this.val
      return title
    }
  },
  methods: {
    closePopup() {
      this.$emit('closePopup')
      this.paramsModal.openEdit = false
    },

    async editList() {
      await this.$emit('editList', {id: this.listId, title: this.title})
      this.$emit('closePopup')
      return this.title
    }
  }
}
</script>
