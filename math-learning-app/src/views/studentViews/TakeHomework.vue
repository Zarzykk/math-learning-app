<template>
  <BaseDashboard>
    <v-container fluid class="full-height">
      <div class="section half-height">
        <h2 class="section-title">Zadania domowe do rozwiązania</h2>
        <v-row>
          <v-col
            v-for="item in upcomingItems"
            :key="item.id"
            cols="12"
            md="4"
          >
            <v-card>
              <v-card-title>{{ item.materialSection }}</v-card-title>
              <v-card-text>
                {{ item.deactivationTime }}
                <br />
                <small>Aktywacja: {{ formatDate(item.activationTime) }}</small><br />
                <small>Dezaktywacja: {{ formatDate(item.deactivationTime) }}</small>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!isWithinActivePeriod(item)"
                  color="primary"
                  :to="{name: 'TakeTest', params: { id: item.id }}"
                >
                  Rozpocznij test
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Sekcja 2: Wydarzenia archiwalne -->
      <div class="section half-height">
        <h2 class="section-title">Rozwiązane zadania</h2>
        <v-row>
          <v-col
            v-for="item in pastItems"
            :key="item.id"
            cols="12"
            md="4"
          >
            <v-card>
              <v-card-title>{{ item.materialSection }}</v-card-title>
              <v-card-text>
                {{ item.deactivationTime }}
                <br />
                <small>{{ formatDate(item.deactivationTime) }}</small>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import apiService from "@/services/apiService";

export default {
  name: "TakeHomework",
  components: {BaseDashboard},
  data() {
    return {
      items: [] // Przechowujemy wszystkie dane z API
    };
  },
  computed: {
    upcomingItems() {
      const today = new Date();
      return this.items.filter((item) => new Date(item.deactivationTime) > today);
    },
    pastItems() {
      const today = new Date();
      return this.items.filter((item) => new Date(item.deactivationTime) <= today);
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await apiService.fetchStudentAssignments('HOMEWORK');
        this.items = response.map(item => ({
          id: item.id,
          materialSection: item.materialSection,
          activationTime: item.activationTime,
          deactivationTime: item.deactivationTime
        }));
        console.log(this.items)
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    },
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      return new Date(date).toLocaleDateString("pl-PL", options);
    },
    isWithinActivePeriod(item) {
      const now = new Date();
      const activationTime = new Date(item.activationTime);
      const deactivationTime = new Date(item.deactivationTime);
      return now >= activationTime && now <= deactivationTime;
    }
  }
};
</script>


<style scoped>
.full-height {
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

/* Sekcje dzielone na pół */
.half-height {
  flex: 1; /* Każda sekcja zajmuje połowę wysokości */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto; /* Dodaj przewijanie w razie potrzeby */
  padding: 16px;
  border-top: 1px solid #ccc;
}

/* Stylizacja tytułów sekcji */
.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
