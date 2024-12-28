<template>
  <div class="no-access">
    <h2>Brak dostępu</h2>
    <p>{{ accessMessage }}</p>
    <v-btn @click="goHome">Powrót na stronę główną</v-btn>
  </div>
</template>

<script>
import { store } from '@/store';

export default {
  computed: {
    accessMessage() {
      return store.accessMessage || 'Nie masz uprawnień do tej strony.';
    }
  },
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.no-access {
  text-align: center;
  margin-top: 50px;
}
</style>
