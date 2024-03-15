<template xmlns="http://www.w3.org/1999/html">
  <v-app-bar app>
    <v-app-bar-title>
      <v-col>
        <v-row v-if="store.userInfo">
           <span class="text-md-body-2">
          Zalogowany jako
           </span>
        </v-row>
        <v-row>
          <span class="text-body-1">
          {{ userFullName }}
                </span>
        </v-row>
      </v-col>

      </v-app-bar-title>
    <v-btn @click="toggleTheme">Zmień motyw</v-btn>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '/src/store';
import { useTheme } from 'vuetify';

const theme = useTheme();

const userFullName = computed(() => {
  return store.userInfo ? `${store.userInfo.firstName} ${store.userInfo.lastName}` : 'Tytuł aplikacji';
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}
</script>

