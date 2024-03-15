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
            label="Wybierz klase"
            :items="allClasses"
            item-title="classYearAndIndex"
            item-value="id"
            solo>
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
                      <v-btn icon class="mx-1" size="2.2em" @click="showCreateTestDialog('EDIT',test.id)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-1" size="2.2em" @click="showCreateTestDialog('VIEW',test.id)">
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
import BaseDashboard from "@/components/BaseDashboard.vue";
import axios from "axios";

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
  },
  methods: {
    fetchHomeworks() {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        try {
          //TODO: filtrowanie, czyli pobieranie z v-autocomplete
          // axios.get(`/api/tests/get/${userInfo.id}?classId=`).then(response => {
          //     this.tests = response.data;
          //   }
          // )
          axios.get(`/api/tests/get/teacher/${userInfo.id}`).then(response => {
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
    }
  }
}
</script>

<style scoped>

</style>
