<template>
  <BaseDashboard>
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5">Tworzenie nowego testu</span>
      <div>
        <v-btn @click="addTask" color="info" class="mx-1 px-5"
               v-if="mode === 'ADD' || mode === 'EDIT'">
          Dodaj zadanie
        </v-btn>
        <v-btn @click="saveTest" color="success" class="mx-1 px-5"
               v-if="mode === 'ADD' || mode === 'EDIT'">
          Zapisz test
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="overflow-y-auto">
      <v-container v-if="isEditActive">
        <TaskEditor @close="isEditActive = false"/>
        <v-btn @click="saveContent">Zapisz Zadanie</v-btn>
      </v-container>
      <v-container v-if="tasks !== null" v-for="(item,index) in tasks" :key="index">
        <TaskEditor />
      </v-container>
    </v-card-text>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/BaseDashboard.vue";
import TaskEditor from "@/components/TaskEditor.vue";
import axios from "axios";

export default {
  name: "TeacherTestManagement",
  components: {TaskEditor, BaseDashboard},
  props: {
    content: String,
  },
  data() {
    return {
      isEditActive: false,
      tasks: [],
      testId: this.$route.query.testId,
      mode: this.$route.query.mode,
      test: null // Tutaj będziemy przechowywać dane testu
    };
  },
  mounted() {
    if (this.mode !== 'ADD') {
      this.fetchTest();
    }
  },
  methods: {
    async fetchTest() {
      try {
        axios.get(`/api/tests/get/${this.testId}`).then(response => {
          this.test = response.data;
          this.tasks = this.test.tasks;
        })
      } catch (error) {
        console.error('Error fetching work:', error);
      }
    },
    closeDialog() {
      this.dialog = false;
    },
    saveTest() {
      this.dialog = false;
      const url = this.mode === 'ADD' ? '/api/tests/create' : `/api/tests/update/${this.testId}`;
      axios.post(url, this.test).then(() => {
        // Obsługa po zapisaniu testu
      }).catch(error => {
        console.error('Error saving work:', error);
      });
    },
    addTask() {
      this.isEditActive = true;
    },
  }
};
</script>

<style scoped>

</style>
