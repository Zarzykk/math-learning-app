<template>
  <BaseDashboard>
    <v-container>
      <v-col>
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
              <p><strong>Wykonane zadania:</strong> {{ assignment.finishedAssignments }} z
                {{ assignment.expectedAssignments }}</p>
              <p><strong>Materiał ID:</strong> {{ assignment.materialId }}</p>
              <p><strong>Typ:</strong> {{ assignment.type || "Nieokreślony" }}</p>
            </v-card-text>
          </v-card>
          <div v-for="(task, index) in assignment.tasks" :key="task.id">
            <FullComponent
              :content="task.content"
              :points="task.points"
              :width="'100%'"
              :height="'250px'"
              @update-answer="updateTaskAnswer(index, $event)"
            />
          </div>
        </div>
        <v-btn
          @click="submitAssignment"
        >Zakończ test
        </v-btn>
      </v-col>
    </v-container>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import apiService from "@/services/apiService";
import MathliveTaskEditor from "@/components/student/MathliveTaskEditor.vue";
import FullComponent from "@/components/editor/FullComponent.vue";

export default {
  name: "TakeTest",
  components: {FullComponent, MathliveTaskEditor, BaseDashboard},
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
      this.assignment.tasks[index].answer = newAnswer;
    },
    async submitAssignment() {
      try {
        const taskList = this.assignment.tasks.map(task => ({
          id: task.id,
          answer: task.answer,
        }));
        const assignment = {
          studentId: JSON.parse(localStorage.getItem('userInfo')).id,
          assignmentId: this.assignment.id,
          tasks: taskList
        }
        await apiService.submitAssignment(assignment);
      } catch (error) {
        console.error('Błąd podczas przesyłania testu', error);
      }
    }
  },
  mounted() {
    this.fetchDetailData()
  }
}
</script>

<style scoped>

</style>
