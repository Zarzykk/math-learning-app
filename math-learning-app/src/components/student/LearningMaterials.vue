<template>
  <BaseDashboard>
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-tabs v-model="activeTab" background-color="primary" dark>
            <v-tab>Działy</v-tab>
            <v-tab>Zadania</v-tab>
          </v-tabs>

          <!-- Treść zakładek -->
          <v-tabs-window v-model="activeTab">
            <!-- Zakładka: Działy -->
            <v-tabs-window-item>
              <v-list>
                <v-list-item
                  v-for="(section, index) in sections"
                  :key="index"
                  @click="selectSection(index)"
                  :class="{ 'selected-item': selectedSectionIndex === index }"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ section.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-tabs-window-item>

            <!-- Zakładka: Zadania -->
            <v-tabs-window-item>
              <v-list>
                <v-list-item
                  v-for="(task, index) in tasks"
                  :key="index"
                  @click="selectTask(index)"
                  :class="{ 'selected-item': selectedTaskIndex === index }"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ task.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>

        <!-- Sekcja główna -->
        <v-col cols="9">
          <v-btn
            v-if="activeTab === 0"
            :disabled="!selectedSection"
            @click="generateContent"
            class="mb-4"
          >
            Generuj
          </v-btn>

          <v-card v-if="generatedContent && activeTab === 0" class="mb-4">
            <!-- Treść zadania -->
            <v-card-title class="font-weight-bold">Treść zadania</v-card-title>
            <v-card-text>
              {{ generatedContent.task }}
            </v-card-text>

            <!-- Kroki rozwiązania -->
            <v-divider></v-divider>
            <v-card-subtitle class="mt-2">Kroki rozwiązania:</v-card-subtitle>
            <v-list>
              <v-list-item
                v-for="(step, index) in visibleSteps"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ step }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn
              v-if="remainingSteps.length > 0"
              text
              class="mt-2"
              @click="nextStep"
            >
              Pokaż następny krok
            </v-btn>

            <!-- Odpowiedź -->
            <v-divider></v-divider>
            <v-card-subtitle class="mt-2">Odpowiedź:</v-card-subtitle>
            <v-card-text v-if="showAnswer">
              {{ generatedContent.answer }}
            </v-card-text>
            <v-btn
              v-if="!showAnswer"
              text
              class="mt-2"
              @click="revealAnswer"
            >
              Pokaż odpowiedź
            </v-btn>
          </v-card>

          <AnswerEditor v-if="generatedContent && activeTab === 0" :data="generatedContent"/>
        </v-col>
      </v-row>
    </v-container>
  </BaseDashboard>
</template>

<script>
import AnswerEditor from "@/components/editor/AnswerEditor.vue";
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import apiService from "@/services/apiService";

export default {
  components: {
    BaseDashboard,
    AnswerEditor
  },
  data() {
    return {
      activeTab: 0, // Aktywna zakładka (0 = Działy, 1 = Zadania)
      sections: [], // Lista działów z API
      tasks: [],
      apiData: [], // Dane pobrane z API
      selectedSectionIndex: null, // Wybrany dział
      selectedTaskIndex: null,
      generatedContent: null,
      visibleSteps: [], // Kroki, które użytkownik już widzi
      remainingSteps: [], // Kroki, które czekają na odkrycie
      showAnswer: false, // Flaga do kontrolowania widoczności odpowiedzi
    };
  },
  computed: {
    selectedItem() {
      return this.selectedIndex !== null ? this.apiData[this.selectedIndex] : null;
    },
    selectedSection() {
      return this.selectedSectionIndex !== null
        ? this.sections[this.selectedSectionIndex]
        : null;
    },
    selectedTask() {
      return this.selectedTaskIndex !== null
        ? this.tasks[this.selectedTaskIndex]
        : null;
    },
  },
  methods: {
    async fetchApiData() {
      // Symulacja pobierania danych z API
      this.sections = [
        {name: "Dział 1", description: "Opis Działu 1"},
        {name: "Dział 2", description: "Opis Działu 2"},
        {name: "Dział 3", description: "Opis Działu 3"},
      ];
      this.tasks = [
        {name: "Zadanie 1", description: "Opis Zadania 1"},
        {name: "Zadanie 2", description: "Opis Zadania 2"},
        {name: "Zadanie 3", description: "Opis Zadania 3"},
      ];
    },
    selectSection(index) {
      this.selectedSectionIndex = index;
    },
    selectTask(index) {
      this.selectedTaskIndex = index;
    },
    async generateContent() {
      if (!this.selectedSection) return;

      // Symulacja zapytania do API
      const responseFromApi = {
        task: `Treść zadania dla elementu: ${this.selectedSection.name}`,
        steps: [
          "Krok 1: Przygotuj dane",
          "Krok 2: Przetwórz dane",
          "Krok 3: Wyświetl wynik",
        ],
        answer: "To jest przykładowa odpowiedź",
      };

      // Ustaw dane w widoku
      this.generatedContent = {
        task: responseFromApi.task,
        steps: responseFromApi.steps,
        answer: responseFromApi.answer,
      };

      this.visibleSteps = [];
      this.remainingSteps = responseFromApi.steps;
      this.showAnswer = false;
    },
    nextStep() {
      if (this.remainingSteps.length > 0) {
        this.visibleSteps.push(this.remainingSteps.shift());
      }
    },
    revealAnswer() {
      this.showAnswer = true;
    },
  },
  mounted() {
    this.fetchApiData();
  },
};
</script>

<style scoped>
.selected-item {
  background-color: #f0f0f0;
  border-left: 4px solid #1976d2;
}
</style>
