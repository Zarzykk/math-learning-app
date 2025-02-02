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
        <v-container>
          <v-expansion-panels v-model="expandedPanel">
            <v-expansion-panel
              v-for="test in tests"
              :key="test.id"
              :value="test.id"
              @click="loadPanelContent(test.id)">
              <v-expansion-panel-title>
                <WorkHeader
                  :class-name="test.classIndex"
                  :materialName="test.materialSection"
                  :start-date="test.activationTime"/>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="test.content">
                  <v-container>
                    <v-row justify="end">
                      <v-btn icon class="mx-1" size="2.2em" @click="openModal('VIEW',test.id)">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-row>
                    <WorkBody
                      :completed-assignments="test.content.finishedAssignments "
                      :expected-assignments="test.content.expectedAssignments"
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
      this.expandedPanel = id;
      this.fetchDetailData(id);
    },
  },
};
</script>
