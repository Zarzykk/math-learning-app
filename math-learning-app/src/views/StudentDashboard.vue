<template>
  <BaseDashboard>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="tile in studentTiles"
        :key="tile.title"
      >
        <v-card
          class="ma-3"
          raised
          @click="goTo(tile.route)"
        >
          <v-card-title>{{ tile.title }}</v-card-title>
          <v-card-text>{{ tile.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text>Przejdź</v-btn>
          </v-card-actions>
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
  data() {
    return {
      studentTiles: [
        {
          title: 'Podejmij Testy',
          description: 'Podejmij dostępne testy i quizy.',
          route: '/take-tests'
        },
        {
          title: 'Prace Domowe',
          description: 'Zobacz i wyślij swoje prace domowe.',
        },
        {
          title: 'Postępy w Nauce',
          description: 'Sprawdź swoje postępy i oceny.',
          route: '/view-progress'
        },
        {
          title: 'Materiały Edukacyjne',
          description: 'Przeglądaj materiały dydaktyczne.',
          route: '/educational-materials'
        },
        // Możesz dodać więcej kafelków zgodnie z potrzebami
      ]
    };
  },
  methods: {
    goTo(route) {
      this.$router.push(route);
    },
    // Nie potrzebujesz tu już metody logout, bo jest ona w BaseDashboard
  }
};
</script>

<style>
/* Twoje style */
</style>
