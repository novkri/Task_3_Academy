<template>
<div>
  <v-container>
    <v-row>
      <v-col sm6 xs6>
        <v-card class="mx-auto mt-6" style="max-width: 500px;">
          <v-toolbar color="grey darken-3" cards dark flat>
            <v-card-title>Логин </v-card-title>
          </v-toolbar>
          
          <v-form ref="form" v-model="form" class="pa-4 pt-6" @submit.prevent="submitHandler">
            <v-text-field v-model="email" :rules="[rules.email, rules.required]" filled label="Email"
              type="email"></v-text-field>

            <!-- type="password" -->
            <v-text-field v-model="password" :rules="[rules.required, rules.length(6)]" filled
              min="6" label="Пароль" type="text"></v-text-field>
          
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn :disabled="!form" class="success" depressed @click="submitHandler" type="submit">Войти
              </v-btn>
              <v-spacer></v-spacer>
              <div class="text--primary">Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    <v-snackbar v-model="error" v-if="error">
      {{ error }} 
    </v-snackbar>
</div>
    
</template>

<script>
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
      error: ''
    }),

    methods: {
      async submitHandler() {
        if (this.email && this.password) {
          const formData = {
            email: this.email,
            password: this.password
          }
          try {
            await this.$store.dispatch('LOGIN', formData)

            this.$router.push('/')
            .catch(err => {
                if (
                  err.name !== 'NavigationDuplicated' &&
                  !err.message.includes('Avoided redundant navigation to current location')
                ) {
                  console.error(err)
                }
              })
            } catch (error) {
              // code: "auth/user-not-found", code: "auth/invalid-email",
              error.code == "auth/invalid-email" ? this.error = 'Некорректный email' : this.error = 'Такого пользователя не существует'
            }
        }
      },
    }
  }
</script>