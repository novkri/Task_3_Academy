<template>
  <v-form @submit.prevent="submit()">
    <v-text-field  v-model="title" solo label="Добавить новую подзадачу" append-icon="add" @blur="closeForm()" placeholder="Название" :rules="[rules.required]"></v-text-field>
  </v-form>
</template>

<script>
export default {
  name: 'newTask',
  data: () => ({
    title: '',
    rules: {
      required: value => !!value || "Required",
    }
  }),
  methods: {
    submit () {
      console.log("submitted");
      // отправить в массив подзадач!
    },
    closeForm () {
      console.log("closeForm");
    }
  },
}
</script>
