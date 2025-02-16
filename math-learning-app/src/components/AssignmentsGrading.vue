<template>
  <BaseDashboard>
    <v-row>
      <!-- Lewa sekcja z listami -->
      <v-col cols="4">
        <!-- Prace przesłane -->
        <h3 class="mb-2">Prace przesłane</h3>
        <v-card
          v-for="assignment in sentAssignments"
          :key="assignment.studentId"
          class="mb-2"
          :class="{ 'selected-card': selectedAssignment?.studentId === assignment.studentId }"
          @click="selectAssignment(assignment)"
        >
          <v-card-text>{{ assignment.firstName }} {{ assignment.lastName }}</v-card-text>
        </v-card>

        <!-- Prace nieprzesłane -->
        <h3 class="mt-4 mb-2">Prace nieprzesłane</h3>
        <v-card
          v-for="task in unsentAssignments"
          :key="task.studentId"
          class="mb-2"
          :class="{ 'selected-card': selectedAssignment?.studentId === task.studentId }"
          @click="selectAssignment(task)">
          <v-card-text>{{ task.firstName }} {{ task.lastName }}</v-card-text>
        </v-card>
      </v-col>

      <!-- Prawa sekcja z dynamicznymi komponentami -->
      <v-col cols="8">
        <div v-if="selectedAssignment"
          v-for="(assignment, index) in selectedAssignment.answers" :key="assignment.taskId">
          <FullComponent
          :content="assignment.answer"
          :width="'100%'"
          :height="'250px'"
        />
        </div>
        <div v-else>

        </div>
      </v-col>
    </v-row>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import apiService from "@/services/apiService";
import FullComponent from "@/components/editor/FullComponent.vue";

export default {
  name: "AssignmentGrading",
  components: {FullComponent, BaseDashboard},
  props: ["id"],
  data() {
    return {
      selectedAssignment: null,
      assignmentResults: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getGradings(this.id);
        this.assignmentResults = response.map((item) => ({
          studentId: item.studentId,
          firstName: item.firstName,
          lastName: item.lastName,
          sent: item.sent,
          answers: item.answers,
        }));
        console.log(response);
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      } finally {
        this.loading = false;
      }
    },
    selectAssignment(assignment) {
      if (this.selectedAssignment !== null && this.selectedAssignment.studentId === assignment.studentId) {
        this.selectedAssignment = null;
        return;
      }
      this.selectedAssignment = assignment;
    },
  },
  computed: {
    sentAssignments() {
      return this.assignmentResults.filter((assignment) => assignment.sent);
    },
    unsentAssignments() {
      return this.assignmentResults.filter((assignment) => !assignment.sent);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.selected-card {
  border: 2px solid #1976d2;
  background-color: #e3f2fd;
  cursor: pointer;
}

.v-card {
  transition: 0.3s;
}

.v-card:hover {
  background-color: #f1f1f1;
}
</style>
