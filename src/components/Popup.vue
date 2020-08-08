<template>
  <v-container>
    <v-row>
      <v-dialog v-model="open">
        <!--  -->
        <v-card>
          <v-card-title>some title</v-card-title>

          <v-card-text>
            <v-container>
              sdlfjsdlkf
            </v-container>
              <v-btn>da</v-btn>
              <v-btn @click="closePopup">net</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'popup',
  data: () => ({
    open: true
  }),
  methods: {
    closePopup() {
       this.$emit('closePopup')
      // console.log( this.open);
      // this.open = false
      // console.log( this.open);
    }
  }
}
</script>
