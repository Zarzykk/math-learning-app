<template>
  <BaseDashboard>
    <v-container>
      <div v-if="assignment">
        <!-- Główne informacje o teście -->
        <v-card class="mb-5">
          <v-card-title>
            Test ID: {{ assignment.id }}
          </v-card-title>
          <v-card-subtitle>
            Sekcja materiału: {{ assignment.materialSection || "Brak informacji" }}
          </v-card-subtitle>
          <v-card-text>
            <p><strong>Czas aktywacji:</strong> {{ formatDate(assignment.activationTime) }}</p>
            <p><strong>Czas dezaktywacji:</strong> {{ formatDate(assignment.deactivationTime) }}</p>
            <p><strong>Punkty maksymalne:</strong> {{ assignment.maxPoints }}</p>
            <p><strong>Wykonane zadania:</strong> {{ assignment.finishedAssignments }} z {{ assignment.expectedAssignments }}</p>
            <p><strong>Materiał ID:</strong> {{ assignment.materialId }}</p>
            <p><strong>Typ:</strong> {{ assignment.type || "Nieokreślony" }}</p>
          </v-card-text>
        </v-card>
        <div v-for="(task, index) in assignment.tasks" :key="task.id">
          <MathliveTaskEditor
            :content="task.content"
            :points="task.points"
            :width="'100%'"
            :height="'250px'"
            @update-answer="updateTaskAnswer(index, $event)"
            />
        </div>
      </div>
      <div v-else>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Ładowanie danych testu...</p>
      </div>
    </v-container>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import apiService from "@/services/apiService";
import MathliveTaskEditor from "@/components/student/MathliveTaskEditor.vue";

export default {
  name: "TakeTest",
  components: {MathliveTaskEditor, BaseDashboard},
  props: ["id"],
  data() {
    return {
      assignment: null
    };
  },
  methods: {
    async fetchDetailData() {
      try {
        this.assignment = await apiService.getAssignmentData(this.id);
        console.log(this.assignment)
      } catch (error) {
        console.error('Błąd podczas ładowania szczegółów testu:', error);
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
    updateTaskAnswer(index, newAnswer) {
      // Zaktualizuj odpowiedź w zadaniu i wykonaj dodatkową logikę, np. zapis do API
      this.assignment.tasks[index].answer = newAnswer;
    }
  },
  mounted() {
    this.fetchDetailData()
  }
}
</script>

<style scoped>

</style>
