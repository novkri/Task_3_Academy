<template>
  <v-container>
    <v-row>
      <v-dialog v-model="paramsModal">
        <v-card>
          <!-- clean title here -->
          <v-card-title>{{paramsModal}}// Добавить дело {{titleTask}}?</v-card-title> 
            <!-- дело Х добавлено в список дел Х -->
          <v-card-text>
            <v-container>
                дело Х добавлено в список дел Х с id {{titleList}}
              <!-- Удалить дело "{{val}}"? -->
            </v-container>

              <!-- and style buttons and card itself !!! -->
              <!-- <v-btn color="red" dark @click="deleteList">da</v-btn> -->
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
