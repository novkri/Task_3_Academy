<template>
<div>
  <v-snackbar v-model="error" v-if="error">
    {{ error }} 
  </v-snackbar>

  <v-card class="mx-auto mt-6" style="max-width: 500px;">
    <v-toolbar color="grey darken-3" cards dark flat>
      <v-card-title>Регистрация</v-card-title>
    </v-toolbar>

    <v-form ref="form" v-model="form" class="pa-4 pt-6" @submit.prevent="submitHandler">
      <v-text-field v-model="username" label="Username" :rules="[rules.required]" filled></v-text-field>

      <v-text-field v-model="email" :rules="[rules.email, rules.required]" filled label="Email"
        type="email"></v-text-field>

      <!-- type="password" -->
      <v-text-field v-model="password" :rules="[rules.required, rules.length(6)]" filled
        min="6" label="Пароль" type="text"></v-text-field>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn :disabled="!form" class="success" depressed @click="submitHandler">Зарегистрироваться
      </v-btn>
      <v-spacer></v-spacer>
      <div class="text--primary">Есть аккаунт? <router-link to="/login">Войти</router-link></div>
    </v-card-actions>
  </v-card>
</div>
    
</template>

<script>
  // import firebase from 'firebase/app'

  export default {
    name: 'register',
    data: () => ({
      form: false,
      email: '',
      password: '',
      username: '',
      error: '',

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
            password: this.password,
            username: this.username
          }

          try {
            await this.$store.dispatch('REGISTER', formData)
            this.$router.push('/')
          } catch (error) {
            error.code == "auth/invalid-email" ? this.error = 'Некорректный email' : this.error = 'Email уже используется'
          }
        }
      },

    }
  }
</script>
