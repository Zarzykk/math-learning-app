<template>
  <v-container fluid class="align-start">
    <v-row class="base-dashboard d-flex justify-space-between">
      <v-col cols="2" class="d-flex justify-center buttons-left">
        <!-- Przycisk POWRÓT -->
        <v-btn @click="goBack">Powrót</v-btn>
      </v-col>
      <v-col cols="8" class="main-content">
        <!-- Slot dla indywidualnej zawartości każdego dashboardu -->
        <slot></slot>
      </v-col>
      <v-col cols="2" class="d-flex justify-center buttons-right">
        <!-- Przycisk WYLOGUJ -->
        <v-btn @click="logout">Wyloguj</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {clearUserInfo} from "@/store";

export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    logout() {
      clearUserInfo();
      this.$router.push('/');
    }
  }
};
</script>

<style>
.base-dashboard {
    margin-top: 0;
  padding-top: 0;
}

.buttons-left, .buttons-right {
  padding-top: 0;
  margin-top: 0;
}

</style>
