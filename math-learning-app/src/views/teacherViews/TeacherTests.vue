<template>
  <BaseDashboard>
    <v-col>
      <v-row>
        <v-col>
          <v-btn @click="createNewTest('ADD', null)">Utwórz Nowy Test</v-btn>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="selectedClass"
            label="Wybierz klase"
            :items="allClasses"
            item-title="classYearAndIndex"
            item-value="id"
            solo
          >
            <template v-slot:append>
              <v-btn @click="fetchTests">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-container>
          <v-expansion-panels>
            <v-expansion-panel v-for="test in tests" :key="test.id" @click="loadPanelContent(test.id)">
              <v-expansion-panel-title>
                <WorkHeader
                  :class-name="test.className"
                  :start-date="test.startDate"/>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="test.content">
                  <v-container>
                    <v-row justify="end">
                      <v-btn icon class="mx-1" size="2.2em" @click="createNewTest('EDIT',test.id)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-1" size="2.2em" @click="createNewTest('VIEW',test.id)">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-row>
                    <WorkBody
                      :completed-tests="test.content.numberOfCompletedTests"
                      :expected-tests="test.content.numberOfExpectedTests"
                      :max-points="test.content.maxPoints"
                      :deactivation-time="test.content.deactivationTime"
                    />
                  </v-container>

                </div>
                <div v-else>
                  Ładowanie szczegółów...
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-row>
    </v-col>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/BaseDashboard.vue";
import TaskEditor from "@/components/TaskEditor.vue";
import TaskManager from "@/components/TaskManager.vue";
import axios from "axios";
import WorkHeader from "@/components/work/WorkHeader.vue";
import WorkBody from "@/components/work/WorkBody.vue";

export default {
  components: {WorkBody, WorkHeader, TaskManager, TaskEditor, BaseDashboard},
  data() {
    return {
      tests: [],
      allClasses: [],
      selectedClass: null,
      expandedPanel: null,
      dialog: false,
      mode: null,
      testId: null,
    };
  },
  mounted() {
    this.fetchTests();
    this.fetchClasses()
  },
  methods: {
    showCreateTestDialog(mode, testId) {
      this.dialog = true;
      this.mode = mode;
      this.testId = testId;
    },
    async fetchTests() {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        try {
          let params = userInfo.id;
          if (this.selectedClass !== null) {
            params = params + "?classId=" + this.selectedClass;
          }
          axios.get(`/api/tests/get/teacher/${params}`).then(response => {
              this.tests = response.data.map(item => ({
                id: item.id,
                className: item.className,
                materialName: item.materialName,
                startDate: item.activationTime,
                content: null,
              }));
            }
          )
        } catch (error) {
          console.log(error);
        }
      }
    },
    async fetchClasses() {
      try {
        const obj = JSON.parse(localStorage.getItem('userInfo'));
        if (obj && obj.id) {
          const response = await axios.get('/api/class/get/' + obj.id);
          this.allClasses = response.data;
        } else {
          console.error('Brak danych użytkownika w localStorage');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    },
    fetchDetailData(id) {
      const test = this.tests.find(p => p.id === id);
      if (test && !test.content) {
        axios.get(`/api/tests/get/${id}/details`).then(response => {
          test.content = response.data;
          this.$forceUpdate;
        })
      }
    },
    loadPanelContent(id) {
      this.expandedPanel = id;
      this.fetchDetailData(id);
    },
    createNewTest(mode, id) {
      if (id != null) {
        this.$router.push({path: '/test-management', query: {mode: mode, testId: id}})
      } else {
        this.$router.push({path: '/test-management', query: {mode: mode}})
      }
    },
    saveTest() {
      // Logika do zapisywania testu
    },
    editTest(test) {
      // Logika edycji testu
    },
    deleteTest(test) {
      // Logika usuwania testu
    }
  },
};
</script>
