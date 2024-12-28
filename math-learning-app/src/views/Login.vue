<template>
  <v-container fluid>
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5">Logowanie</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="handleLogin">
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {jwtDecode} from 'jwt-decode';
import { setToken, setUserInfo, setAccessDenied } from "@/store"; // Importujemy setAccessDenied
import apiService from "@/services/apiService";

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
    async handleLogin() {
      if (await this.$refs.form.validate()) {
        try {
          const result = await apiService.login(this.loginForm);
          console.log('Logged in:', result);
          this.handleLoginSuccess(result);
        } catch (error) {
          console.error('Login failed', error);
        }
      }
    },
    handleLoginSuccess(data) {
      setToken(data.token);
      setUserInfo(data.userInfo);
      setAccessDenied(false); // Czyszczenie flagi braku dostępu po udanym logowaniu
      this.redirectUserBasedOnRole(data.token);
    },
    redirectUserBasedOnRole(token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role; // Zakładamy, że role są przechowywane w tokenie
        console.log('User role:' + userRole);
        if (userRole === 'ROLE_TEACHER') {
          this.$router.push('/teacher-dashboard');
        } else if (userRole === 'ROLE_STUDENT') {
          this.$router.push('/student-dashboard');
        } else {
          // Opcjonalnie: przekieruj na stronę błędu lub domyślną
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Błąd dekodowania tokena:', error);
        // Opcjonalnie: obsługa błędów dekodowania tokena
      }
    },
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
