<template width="500">
  <v-container width="500">
    <v-row width="500">
      <v-dialog v-model="paramsModal" slot="dialogAdd" width="500">
        <v-card width="500">
          <v-card-title v-if="!titleList">Задача добавлена <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn></v-card-title>
          <v-card-title v-else>Подзадача добавлена <v-spacer></v-spacer> <v-btn @click="closePopup"><v-icon>close</v-icon></v-btn></v-card-title>
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
       this.paramsModal.open = false
    },
  }
}
</script>
