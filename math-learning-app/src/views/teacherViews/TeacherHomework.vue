<template>
  <BaseDashboard>
    <v-col>
      <v-row>
        <v-col>
          <v-btn @click="openModal('ADD')">Utwórz Nowy Test</v-btn>
          <TestManagementModal
            :visible="showModal"
            :itemid="itemId"
            :mode="mode"
            :classes-list="allClasses"
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
              v-for="homework in homeworks"
              :key="homework.id"
              :value="homework.id"
              @click="loadPanelContent(homework.id)">
              <v-expansion-panel-title>
                <WorkHeader
                  :class-name="homework.classIndex"
                  :materialName="homework.materialSection"
                  :start-date="homework.activationTime"/>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="homework.content">
                  <v-container>
                    <v-row justify="end">
                      <v-btn icon class="mx-1" size="2.2em" @click="openModal('VIEW',homework.id)">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-row>
                    <WorkBody
                      :completed-assignments="homework.content.finishedAssignments "
                      :expected-assignments="homework.content.expectedAssignments"
                      :max-points="homework.content.maxPoints"
                      :deactivation-time="homework.content.deactivationTime"
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
import TaskManager from "@/components/TaskManager.vue";
import WorkBody from "@/components/work/WorkBody.vue";
import WorkHeader from "@/components/work/WorkHeader.vue";
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import axios from "axios";
import apiService from "@/services/apiService";
import TestManagementModal from "@/components/TestManagementModal.vue";

export default {
  name: "TeacherHomework",
  components: {TestManagementModal, BaseDashboard, WorkHeader, WorkBody, TaskManager},
  data() {
    return {
      homeworks: [],
      allClasses: [],
      selectedClass: null,
      expandedPanel: null,
      dialog: false,
      showModal: false,
      mode: null,
      itemId: null,
    }
  },
  mounted() {
    this.fetchClasses();
    this.fetchAssignments();
  },
  methods: {
    openModal(mode, itemId = null) {
      this.mode = mode;
      this.itemId = itemId;
      this.showModal = true;
    },
    async fetchAssignments() {
      const userInfoString = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      try {
        this.homeworks = await apiService.fetchAssignments(userInfo.id, 'HOMEWORK');
        console.log(this.homeworks)
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
      const homework = this.homeworks.find(p => p.id === id);
      if (homework && !homework.content) {
        try {
          const assignment = await apiService.getAssignmentData(id); //
          homework.content = assignment;
        } catch (error) {
          console.error('Błąd podczas ładowania szczegółów zadania domowego:', error);
        }
      }
    },
    loadPanelContent(id) {
      this.expandedPanel = id;
      this.fetchDetailData(id);
    }
  }
}
</script>

<style scoped>

</style>
