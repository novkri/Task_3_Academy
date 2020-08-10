<template>
  <v-container>
    <v-row>
      <v-dialog v-model="paramsModal">
        <v-card>
          <!-- clean title here -->
          <v-card-title>{{paramsModal}}// Title: {{val}} + id {{listId}}</v-card-title> 

          <v-card-text>
            <v-container>
              Удалить дело "{{val}}"?
            </v-container>

              <!-- and style buttons and card itself !!! -->
              <v-btn color="red" dark @click="deleteList">da</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="closePopup" color="success" dark>net</v-btn>

          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'popup',
  props: ['val', 'listId'],
  data: () => ({
    paramsModal: {
      open: true,
      // title: '' // probably dont nned it anymore
    }
  }),
  methods: {
    closePopup() {
      this.$emit('closePopup')
    },

    async deleteList(listId) {
      await this.$emit('deleteList', listId)
      this.$emit('closePopup')
    }
  }
}
</script>
