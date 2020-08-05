<template>
  <v-container pt-0 pr-0 pb-0 pl-0>
    <v-form ref="form" @submit.prevent="submit()">
      <v-text-field @blur="closeForm()" append-icon="add" solo v-model="title" placeholder="Название" :rules="[rules.required]"></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'newList',
  data: () => ({
    title: '',
    rules: {
      required: value => !!value || "Required",
    }
  }),
  methods: {
    submit () {
      console.log("submitted");
      // отправить в массив заданий!
    },
    closeForm () {
     console.log("closeform");
    }
  },
  mounted () {
    this.$refs.input.focus()
  }
}
</script>
