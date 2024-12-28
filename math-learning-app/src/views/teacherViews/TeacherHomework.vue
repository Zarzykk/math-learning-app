<template>
  <BaseDashboard>
    <v-col>
      <v-row>
        <v-col>
          <v-btn @click="showCreateTestDialog('ADD',null)">Utwórz nowe zadanie</v-btn>
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
              <v-btn>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-container>
          <v-expansion-panels>
            <v-expansion-panel v-for="homework in homeworks" :key="homework.id" @click="loadPanelContent(homework.id)">
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
                      <v-btn icon class="mx-1" size="2.2em" @click="showCreateTestDialog('EDIT',homework.id)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-1" size="2.2em" @click="showCreateTestDialog('VIEW',homework.id)">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </v-row>
                    <WorkBody
                      :completed-tests="homework.content.numberOfCompletedTests"
                      :expected-tests="homework.content.numberOfExpectedTests"
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
    <v-dialog v-model="dialog" max-width="1000px" max-height="800px">
      <v-card height="800px">
        <TaskManager
          :mode="mode"
          :test-id="testId"/>
      </v-card>
    </v-dialog>

  </BaseDashboard>
</template>

<script>
import TaskManager from "@/components/TaskManager.vue";
import WorkBody from "@/components/work/WorkBody.vue";
import WorkHeader from "@/components/work/WorkHeader.vue";
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import axios from "axios";
import apiService from "@/services/apiService";

export default {
  name: "TeacherHomework",
  components: {BaseDashboard, WorkHeader, WorkBody, TaskManager},
  data() {
    return {
      homeworks: [],
      allClasses: [],
      selectedClass: null,
    }
  },
  mounted() {
    this.fetchClasses();
    this.fetchAssignments();
  },
  methods: {
    async fetchAssignments() {
      const userInfoString = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      try {
        const assignmentsResponse = await apiService.fetchAssignments(userInfo.id, 'HOMEWORK');
        this.homeworks = assignmentsResponse;
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
    }
  }
}
</script>

<style scoped>

</style>
