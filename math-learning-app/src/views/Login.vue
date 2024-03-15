<template>
  <v-container fluid>
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5">Logowanie</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="login">
              <v-text-field
                label="Email"
                v-model="loginForm.email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                label="Hasło"
                v-model="loginForm.password"
                :rules="passwordRules"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block>Zaloguj</v-btn>
            </v-form>
            <v-btn @click="loginWithTeams" color="secondary" block>Zaloguj przez Microsoft Teams</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {jwtDecode} from 'jwt-decode';
import {setToken, setUserInfo} from "@/store";

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      emailRules: [
        v => !!v || 'Email jest wymagany',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Niepoprawny adres email',
      ],
      passwordRules: [
        v => !!v || 'Hasło jest wymagane',
        v => v.length >= 6 || 'Hasło musi zawierać co najmniej 6 znaków',
      ],
    };
  },
  methods: {
    async login() {
      if (await this.$refs.form.validate()) {
        try {
          const response = await this.$axios.post('http://localhost:8080/authenticate', this.loginForm);
          this.handleLoginSuccess(response.data);
          // console.log('Login successful:', response);
          // console.log(jwtDecode(localStorage.getItem('userToken')))
        } catch (error) {
          // console.log('Login error:', error);
          // Tutaj możesz obsłużyć błędy logowania, np. pokazać komunikat użytkownikowi
        }
      }
    },
    loginWithTeams() {
      // Logika logowania przez Microsoft Teams
    },
    handleLoginSuccess(data) {
      setToken(data.token)
      setUserInfo(data.userInfo);
      this.redirectUserBasedOnRole(data.token);
    },
    redirectUserBasedOnRole(token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken)
        const userRole = decodedToken.role; // Zakładając, że role są przechowywane w tokenie
        console.log('User role:' +userRole)
        if (userRole === ('ROLE_TEACHER')) {
          this.$router.push('/teacher-dashboard');
        } else if (userRole === ('ROLE_STUDENT')) {
          this.$router.push('/student-dashboard');
        } else {
          // Opcjonalnie: przekieruj na stronę błędu lub domyślną
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Błąd dekodowania tokena:', error);
        // Opcjonalnie: obsługa błędów dekodowania tokena
      }
    }
  },
};
</script>

<style scoped>
.fill-height {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
