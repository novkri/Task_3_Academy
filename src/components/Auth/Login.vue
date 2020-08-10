<template>
    <v-card class="mx-auto mt-6" style="max-width: 500px;">
      <v-toolbar color="grey darken-3" cards dark flat>
        <v-card-title>Логин</v-card-title>
      </v-toolbar>

      <v-form ref="form" v-model="form" class="pa-4 pt-6" @submit.prevent="submitHandler">
        <v-text-field v-model="email" :rules="[rules.email, rules.required]" filled label="Email"
          type="email"></v-text-field>

        <!-- type="password" -->
        <v-text-field v-model="password" :rules="[rules.required, rules.length(6)]" filled
          min="6" label="Пароль" type="text"></v-text-field>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn :disabled="!form" class="success" depressed @click="submitHandler">Войти
        </v-btn>
      </v-card-actions>
    </v-card>


</template>

<script>
  import firebase from 'firebase/app'

  export default {
    name: 'login',
    data: () => ({
      form: false,
      email: '',
      password: '',
      rules: {
        email: v => !!(v || '').match(/@/) || 'Некорректный email',
        length: len => v => (v || '').length >= len || `Пароль должен быть больше ${len} сииволов`,
        password: v => !!v || 'Пароль не может быть пустым',
        required: v => !!v || 'Это поле не может быть пустым',
      },
    }),
    methods: {
      async submitHandler() {
        if (this.email && this.password) {
          const formData = {
            email: this.email,
            password: this.password
          }
          console.log(formData);

          try {
            console.log("logged")
            await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            this.$router.push('/')
          } catch (e) {
            console.log(e)
          }
        }
      },

    }
  }
</script>