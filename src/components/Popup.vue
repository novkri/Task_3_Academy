<template>
  <v-container>
    <v-row>
      <v-dialog v-model="paramsModal">
        <!--  -->
        <v-card>
          <v-card-title>{{paramsModal}}// Title: {{val}} + id {{listId}}</v-card-title>

          <v-card-text>
            <v-container>
              Удалить дело "{{val}}"?
            </v-container>
              <v-btn color="red" dark @click="deleteList">da</v-btn>
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
  // props: {
  //   open: Boolean,
  //   title: String
  // },
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
      // here get id AND ttile and return id to Parent
      await this.$emit('deleteList', listId)
      console.log("submitDelete заглушка");
      this.$emit('closePopup')
    }
  }
}
</script>
