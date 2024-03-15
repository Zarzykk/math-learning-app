<template>
  <BaseDashboard>
    <v-row>
      <!-- Kafelek do zarządzania testami -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="ma-3" raised @click="goTo('/manage-tests')">
          <v-card-title>Zarządzanie Testami</v-card-title>
          <v-card-text>Twórz i oceniaj testy online.</v-card-text>
        </v-card>
      </v-col>

      <!-- Kafelek do przypisywania zadań domowych -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="ma-3" raised @click="goTo('/assign-homework')">
          <v-card-title>Przypisywanie Zadań Domowych</v-card-title>
          <v-card-text>Przypisz i oceniaj zadania domowe.</v-card-text>
        </v-card>
      </v-col>

      <!-- Kafelek do śledzenia postępów uczniów -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="ma-3" raised @click="goTo('/track-progress')">
          <v-card-title>Śledzenie Postępów Uczniów</v-card-title>
          <v-card-text>Monitoruj postępy i wyniki uczniów.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from '@/components/BaseDashboard.vue';

export default {
  components: {
    BaseDashboard
  },
  methods: {
    goTo(route) {
      this.$router.push(route);
    }
  }
};
</script>
