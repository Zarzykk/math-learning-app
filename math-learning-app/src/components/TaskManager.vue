<template>
  <v-card-title class="d-flex justify-space-between align-center">
    <span class="text-h5">Zarządzaj zadaniami</span>
    <div>
      <v-btn icon @click="addTask" color="info" class="mx-1 px-5"
             v-if="mode === 'ADD' || mode === 'EDIT'">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon @click="saveTest" color="success" class="mx-1 px-5"
             v-if="mode === 'ADD' || mode === 'EDIT'">
        <v-icon>mdi-content-save-outline</v-icon>
      </v-btn>
      <v-btn icon @click="closeDialog" color="error" class="mx-1 px-5">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>
    </div>
  </v-card-title>
  <v-card-text class="overflow-y-auto">
    <v-container v-if="isEditActive">
      <TaskEditor @close="isEditActive = false"/>
      <v-btn @click="saveContent">Zapisz Zadanie</v-btn>
    </v-container>
    <v-container v-if="tasks !== null" v-for="(item,index) in tasks" :key="index">
      <TaskEditor :content="item.text"
      />
    </v-container>
  </v-card-text>
</template>


<script>
import axios from 'axios';
import TaskEditor from "@/components/TaskEditor.vue";

export default {
  components: {TaskEditor},
  props: {
    mode: String,
    testId: {
      type: [String, Number],
      default: null
    },
    content: String,
  },
  data() {
    return {
      isEditActive: false,
      tasks: [],
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
