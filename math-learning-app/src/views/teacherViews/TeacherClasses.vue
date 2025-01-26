<template>
  <BaseDashboard>
    <v-container class="select-container">
      <v-col>
        <v-autocomplete
          v-model="selectedClass"
          :items="classes"
          class="autocomplete-item"
          label="Wybierz klasę"
          item-title="className"
          item-value="id"
          return-object>
          <template v-slot:append>
            <v-btn
            @click="fetchStudents(this.selectedClass)">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-autocomplete>
      </v-col>
    </v-container>
    <v-container>
      <v-expansion-panels>
        <v-expansion-panel v-for="student in students" :key="student.id">
          <div v-if="student.id">
            <v-expansion-panel-title>
              <v-col cols="4">
                <v-row>
                  <span class="text-h6">Imię</span>
                </v-row>
                <v-row>
                  <span class="text-body-1">{{ student.firstName }}</span>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row>
                  <span class="text-h6">Nazwisko</span>
                </v-row>
                <v-row>
                  <span class="text-body-1">{{ student.lastName }}</span>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row>
                  <span class="text-h6">Klasa</span>
                </v-row>
                <v-row>
                  <span class="text-body-1">{{ student.classIndex }}</span>
                </v-row>
              </v-col>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <v-row>
                      <span class="text-h6">Rozwiązane sprawdziany</span>
                    </v-row>
                    <v-row>
                      <span class="text-body-1">{{ student.completedTests }}</span>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-row>
                      <span class="text-h6">Rozwiązane prace domowe</span>
                    </v-row>
                    <v-row>
                      <span class="text-body-1">{{ student.completedHomeworks }}</span>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-row justify="end">
                      <v-btn icon class="mx-1" size="2.2em" @click="openModal('VIEW',homework.id)">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </div>

        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from '@/components/shared/BaseDashboard.vue';
import axios from 'axios';
import apiService from "@/services/apiService";

export default {
  components: {
    BaseDashboard
  },
  data() {
    return {
      students: [],
      classes: [],
      selectedClass: null,
      visibleStudentId: null,
      completedTests: null,
      completedHomeworks: null
    };
  },
  mounted() {
    this.fetchClasses();
    this.fetchStudents();
  },
  methods: {
    async handleChange() {
      //TODO: filtrowanie, czyli pobieranie z v-autocomplete
      console.log(this.selectedClass)
      // try {
      //   const response = await axios.get(`/api/students/get/class/${classId}`)
      //   this.students = response.data;
      //   this.visibleStudentId.value = null;
      // } catch (error) {
      //   console.error('Error fetching students:', error);
      // }
    },
    async fetchStudents() {
      try {
        const studentsResponse = await apiService.fetchStudents(JSON.parse(localStorage.getItem('userInfo')).id);
        this.students = studentsResponse.map((item) => ({
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          classIndex: item.classIndex,
          completedTests: item.completedTests,
          completedHomeworks: item.completedHomeworks
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    async fetchClasses() {
      try {
        const classesResponse = await apiService.fetchClasses(JSON.parse(localStorage.getItem('userInfo')).id);
        this.classes = classesResponse.map((item) => ({
          id: item.id,
          classYear: item.classYear,
          className: `${item.classYear}${item.classIndex}`
        }));
        console.log(this.classes)
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10px; /* Odstęp od góry */
}

.select-container {
  width: 90%; /* Dostosuj szerokość zgodnie z preferencjami */
  margin: 20px 0; /* Zwiększam górny i dolny margines dla większej separacji */
}

.class-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box; /* Upewniam się, że padding nie zwiększa szerokości */
}

/* Stylowanie etykiety */
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: left; /* Wyśrodkowanie tekstu etykiety może być mylące */
}

.students-list {
  width: 90%; /* Dostosuj szerokość zgodnie z preferencjami */
  margin-top: 10vh; /* Używam jednostki vh dla odstępu zależnego od wysokości viewportu */
}

.student {
  cursor: pointer;
  border-bottom: 1px solid #eee;
  padding: 10px 0; /* Dodaję padding dla lepszej czytelności */
}
</style>
