<template>
  <BaseDashboard>
    <v-col>
      <v-row>
        <v-col>
          <v-btn @click="openModal('ADD')">Utwórz Nowy Test</v-btn>
          <TestManagementModal
            v-if="showModal"
            :visible="showModal"
            :itemid="itemId"
            :mode="mode"
            :classes-list="allClasses"
            :selected-test="selectedTest"
            @close="showModal = false"/>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="selectedClass"
            :items="allClasses"
            class="autocomplete-item"
            label="Wybierz klasę"
            item-title="className"
            item-value="id"
            return-object>
            <template v-slot:append>
              <v-btn @click="fetchAssignments">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-container fluid class="full-height">
          <div class="section half-height">
            <h2 class="section-title">Nadchodzące testy</h2>
            <v-expansion-panels v-model="expandedPanel">
              <v-expansion-panel
                v-for="item in upcomingItems"
                :key="item.id"
                :value="item.id"
                @click="loadPanelContent(item.id)">
                <v-expansion-panel-title>
                  <WorkHeader
                    :class-name="item.classIndex"
                    :materialName="item.materialSection"
                    :start-date="item.activationTime"/>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div v-if="item.content">
                    <v-container>
                      <v-row justify="end">
                        <v-btn icon class="mx-1" size="2.2em" @click="openModal('VIEW',item.id)">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </v-row>
                      <WorkBody
                        :completed-assignments="item.content.finishedAssignments "
                        :expected-assignments="item.content.expectedAssignments"
                        :max-points="item.content.maxPoints"
                        :deactivation-time="item.content.deactivationTime"
                      />
                    </v-container>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          <div class="section half-height">
            <h2 class="section-title">Testy archiwalne</h2>
            <v-expansion-panels v-model="expandedPanel">
              <v-expansion-panel
                v-for="test in pastItems"
                :key="test.id"
                :value="test.id">
                <v-expansion-panel-title>
                  <WorkHeader
                    :class-name="test.classIndex"
                    :materialName="test.materialSection"
                    :start-date="test.activationTime"/>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-container>
                      <v-row justify="end">
                        <v-btn
                          class="mx-1"
                          icon
                          size="2.2em"
                          :to="{name: 'AssignmentsGrading', params: { id: test.id }}">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </v-row>
                      <WorkBody
                        :completed-assignments="test.finishedAssignments "
                        :expected-assignments="test.expectedAssignments"
                        :max-points="test.maxPoints"
                        :deactivation-time="test.deactivationTime"
                      />
                    </v-container>

                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-container>
      </v-row>
    </v-col>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import TaskEditor from "@/components/TaskEditor.vue";
import TaskManager from "@/components/TaskManager.vue";
import WorkHeader from "@/components/work/WorkHeader.vue";
import WorkBody from "@/components/work/WorkBody.vue";
import TestManagementModal from "@/components/TestManagementModal.vue";
import apiService from "@/services/apiService";

export default {
  components: {TestManagementModal, WorkBody, WorkHeader, TaskManager, TaskEditor, BaseDashboard},
  data() {
    return {
      tests: [],
      allClasses: [],
      selectedClass: null,
      expandedPanel: null,
      dialog: false,
      showModal: false,
      mode: null,
      itemId: null,
      selectedTest: null
    };
  },
  mounted() {
    this.fetchAssignments();
    this.fetchClasses()
  },
  computed: {
    upcomingItems() {
      const today = new Date();
      return this.tests.filter((item) => new Date(item.activationTime) > today);
    },
    pastItems() {
      const today = new Date();
      return this.tests.filter((item) => new Date(item.activationTime) <= today);
    }
  },
  methods: {
    openModal(mode, itemId = null) {
      this.mode = mode;
      this.itemId = itemId;

      if (itemId) {
        // Pobierz szczegóły testu przed otwarciem modala
        this.fetchDetailData(itemId).then(() => {
          console.log('Data fetched, opening modal...');
          this.showModal = true; // Otwórz modal po załadowaniu danych
        }).catch(error => {
          console.error('Error fetching test details:', error);
        });
      } else {
        // W trybie ADD otwórz modal bez danych
        this.selectedTest = null;
        this.showModal = true;
      }
    },
    async fetchAssignments() {
      const userInfoString = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      try {
        this.tests = await apiService.fetchAssignments(userInfo.id, 'EXAM');
        console.log(this.tests)
      } catch (error) {
        console.log(error);
      }
    },
    async fetchClasses() {
      try {
        const classesResponse = await apiService.fetchClasses(JSON.parse(localStorage.getItem('userInfo')).id);
        this.allClasses = classesResponse.map((item) => ({
          id: item.id,
          classYear: item.classYear,
          className: `${item.classYear}${item.classIndex}`
        }));
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    },
    async fetchDetailData(id) {
      const test = this.tests.find(p => p.id === id);
      if (test && !test.content) {
        try {
          const assignment = await apiService.getAssignmentData(id);
          test.content = assignment;
          this.selectedTest = assignment;
        } catch (error) {
          console.error('Błąd podczas ładowania szczegółów testu:', error);
        }
      }
    },
    loadPanelContent(id) {
      if (this.expandedPanel === null) {
      this.expandedPanel = id;
      } else {
        this.expandedPanel = null;
      }
    },
  },
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
  padding: 16px;
  border-top: 1px solid #ccc;
}
</style>
