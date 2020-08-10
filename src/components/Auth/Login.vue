<template>
  <div>
    <!-- class="grey darken-1  -->
    <!-- задать размеры формы не на весь экран -->
<!-- v-model="valid" -->
    <v-form  @submit.prevent="submitHandler">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
<!--:rules="emailRules"  -->
            <v-text-field v-model="email" label="E-mail" required></v-text-field>

            <!-- :rules="passwordRules" :counter="10"  -->
            <v-text-field  v-model="password" label="password" required>
            </v-text-field>

<!-- :disabled="!valid"  @click="login"-->
            <v-btn  color="success" class="mr-4" type="submit">
              login <v-icon>send</v-icon>
            </v-btn>

            <p class="center">Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
            <!-- + here link to registration -->
          </v-col>
        </v-row>
      </v-container>
    </v-form>


  </div>
</template>

<script>
import firebase from 'firebase/app'

  export default {
    name: 'login',
    data: () => ({
      email: '',
      password: ''
    }),
    methods: {
      async submitHandler() {
        // валидации пока нет
        if (this.email && this.password) {
          const formData = {
            email: this.email,
            password: this.password
          }
          console.log(formData);

          try {
            console.log("logged")
            await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            // await this.$store.dispatch('login', formData)
            this.$router.push('/')
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  }
</script>
