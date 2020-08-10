<template>
  <div>
      <!-- <div v-if="error" class="error">{{error.message}}</div> -->
    <!-- class="grey darken-1  -->
    <!-- задать размеры формы не на весь экран -->
<!-- v-model="valid" -->
    <v-form  @submit.prevent="submitHandler">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
<!--:rules="emailRules"  -->
            <v-text-field v-model="username" label="Username" required></v-text-field>

            <v-text-field v-model="email" label="Email" required></v-text-field>

            <!-- :rules="passwordRules" :counter="10"  -->
            <v-text-field  v-model="password" label="password" required>
            </v-text-field>

<!-- :disabled="!valid"  @click="login"-->
            <v-btn  color="success" class="mr-4" type="submit">
              register <v-icon>send</v-icon>
            </v-btn>

            <p class="center">Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
            <!-- + here link to registration -->
          </v-col>
        </v-row>
      </v-container>
    </v-form>


  </div>
</template>

<script>
// import firebase from 'firebase/app'
  export default {
    name: 'register',
    data: () => ({
      email: '',
      password: '',
      username: '',
      error: ''
    }),
    methods: {
      async submitHandler() {
        // валидации пока нет
        if (this.email && this.password) {
          const formData = {
            email: this.email,
            password: this.password,
            username: this.username
          }

          console.log(formData);
          await this.$store.dispatch('REGISTER', formData)

          // try {
          //   await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)

            this.$router.push('/login') // redirect to login?
          // } catch (e) {
          //   console.log(e)
          // }
        }
      }
    }
  }
</script>
