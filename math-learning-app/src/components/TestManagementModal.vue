<template>
  <BaseModal :visible="visible" @close="handleClose" size="large">
    <template #header>
      <div class="header-container">
        <div class="first-row">
          <span class="text-h5">Tworzenie nowego testu</span>
          <v-row>
            <v-date-input
              label="Data startu"
              v-model="activationDate"
              prepend-icon=""
              prepend-inner-icon="$calendar"
              variant="underlined"
              @change="saveActivDate"
              max-width="330"
            ></v-date-input>
            <v-text-field
              v-model="activationTime"
              :active="menu1"
              :focus="menu1"
              variant="underlined"
              prepend-icon=""
              prepend-inner-icon="mdi-clock-time-four-outline"
              readonly
              max-width="80"
            >
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <v-time-picker
                  v-if="menu1"
                  format="24hr"
                  v-model="activationTime"
                  @change="saveActivDate"
                  full-width
                ></v-time-picker>
              </v-menu>
            </v-text-field>
            <v-date-input
              label="Data zakończenia"
              v-model="deactivationDate"
              prepend-icon=""
              prepend-inner-icon="$calendar"
              variant="underlined"
              max-width="330"
            ></v-date-input>
            <v-text-field
              v-model="deactivationTime"
              :active="menu2"
              :focus="menu2"
              variant="underlined"
              prepend-icon=""
              prepend-inner-icon="mdi-clock-time-four-outline"
              readonly
              max-width="80"
            >
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <v-time-picker
                  v-if="menu2"
                  format="24hr"
                  v-model="deactivationTime"
                  full-width
                ></v-time-picker>
              </v-menu>
            </v-text-field>
          </v-row>
          <v-checkbox
            v-model="checked"
            label="Wygeneruj zadania"
            class="checkbox-right">
          </v-checkbox>
        </div>
        <div class="second-row">
          <div class="left-side">
            <v-autocomplete
              v-model="selectedClass"
              :items="classesList"
              class="autocomplete-item"
              label="Wybierz klasę"
              item-title="className"
              item-value="id"
              return-object></v-autocomplete>
            <v-autocomplete
              v-model="selectedMaterial"
              :items="filteredMaterials"
              class="autocomplete-item"
              label="Wybierz materiał"
              item-title="section"
              item-value="id"
              return-object></v-autocomplete>
          </div>
          <div class="right-side">
            <v-text-field
              v-if="checked"
              v-model="positiveNumber"
              label="Wprowadź liczbę"
              type="number"
              :rules="[validatePositive]"
              class="number-field"
            ></v-text-field>
            <v-btn
              v-if="checked"
              class="search-btn"
              @click="generate"
              :disabled="!isSearchEnabled"
            >Generuj
            </v-btn>
          </div>
        </div>
      </div>
    </template>
    <template #body>
      <div v-for="(task, index) in tasks" :key="index">
        <MathliveTextEditor
          :task-content="task"
          :task-number="index"
          :width="'100%'"
          :height="'200px'"
          :editable="false"
          @update-task="updateTask"
        ></MathliveTextEditor>
      </div>
    </template>

    <template #footer>
      <div class="footer-left">
        <v-btn @click="saveTest" color="success" class="mx-1 px-5"
               v-if="mode === 'ADD' || mode === 'EDIT'">
          Zapisz test
        </v-btn>
        <v-btn @click="addTask" color="info" class="mx-1 px-5"
               v-if="mode === 'ADD' || mode === 'EDIT'">
          Dodaj zadanie
        </v-btn>
      </div>
      <div class="footer-right">
        <v-btn @click="handleClose">Zamknij</v-btn>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import apiService from '@/services/apiService';
import BaseModal from './shared/BaseModal.vue';
import MathliveTextEditor from "@/components/student/MathliveTextEditor.vue";
import CustomDateTimePicker from "@/components/shared/CustomDateTimePicker.vue";

export default {
  components: {
    MathliveTextEditor,
    CustomDateTimePicker,
    BaseModal
  },
  data() {
    return {
      checked: false,
      positiveNumber: null,
      materialsList: [],
      tasks: [],
      selectedClass: null,
      selectedMaterial: null,
      activationDate: null,
      activationTime: null,
      deactivationDate: null,
      deactivationTime: null,
      time: null,
      menu1: false,
      modal1: false,
      menu2: false,
      modal2: false,
    };
  },
  watch: {
    selectedMaterial(newVal) {
      if (newVal) {
        const relatedToFirst = this.classesList.find(
          (item) => item.classYear === newVal.classYear
        );
        if (relatedToFirst) this.selectedClass = relatedToFirst;
      }
    },
    checked(newVal) {
      if (!newVal) {
        this.positiveNumber = null;
      }
    },
    visible(newVal) {
      console.log('visible changed to:', newVal);
      if (newVal) {
        this.$nextTick(() => {
          console.log('Before fetchData - visible:', this.visible, 'itemId:', this.itemId);
          this.fetchData();
        });
      }
    },
    itemId(newVal, oldVal) {
      console.log('itemId changed from:', oldVal, 'to:', newVal);
      if (this.visible) {
        this.fetchData();
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    mode: String,
    itemId: {
      type: [String, Number],
      default: null
    },
    classesList: {
      type: Array
    }
  },
  mounted() {
    console.log('Child mounted - itemId:', this.itemId, 'mode:', this.mode);
  },
  methods: {
    async fetchData() {
      try {
        console.log('fetchData called with itemId:', this.itemId, 'mode:', this.mode);
        if (this.mode === 'VIEW') {
          if (this.itemId !== null) {
            this.tasks = await apiService.getAssigmentTasks(this.itemId);
            console.log('Fetched tasks for itemId:', this.itemId, this.tasks);
          } else {
            console.error('Error: itemId is required for VIEW or EDIT mode');
          }
        } else if (this.mode === 'ADD') {
          // Scenariusz: Tworzenie nowego testu (bez itemId)
          this.tasks = []; // Inicjalizacja pustej listy zadań
          console.log('Initialized empty tasks list for ADD mode.');
        }

        const materialsResponse = await apiService.fetchMaterials();
        this.materialsList = materialsResponse.map((item) => ({
          id: item.id,
          classYear: item.classYear,
          schoolType: item.schoolType,
          section: item.section
        }));
      } catch (error) {

      }
    },
    saveActivDate(value) {
      this.activationDate = value;
    },
    saveActivTime(value) {
      this.time = value;
    },
    async generate() {
      this.loading = true; // Włączenie animacji ładowania

      const message = `Utwórz dla mnie ${this.positiveNumber} zadań matematycznych z działu ${this.selectedMaterial.section}, niech te zadania nie będą do siebie podobne`;

      try {
        const response = await apiService.continueConversation(message, null);
        // Zakładamy, że data.tasks zawiera tablicę zadań w odpowiedzi API
        if (response.tasks && Array.isArray(response.tasks)) {
          // Dodanie zadań do listy zdekodowanych zadań
          this.tasks.push(...response.tasks);
        } else {
          console.error('Błąd: odpowiedź nie zawiera prawidłowej tablicy zadań');
        }
      } catch (error) {
        console.error('Błąd podczas wysyłania zapytania:', error);
      }
      console.log(this.tasks)
      this.loading = false;
    },
    handleClose() {
      this.selectedClass = null;
      this.selectedMaterial = null;
      this.checked = false;
      this.$emit('close');
    },
    validatePositive(value) {
      return value > 0 || "Wartość musi być dodatnia!";
    },
    addTask() {
      if (!this.hasEmptyTask()) {
        this.tasks.push({content: "", answer: ""})
      }
    },
    hasEmptyTask() {
      return this.tasks.some(task => (task.content === "" || task.answer === ""));
    },
    formattedDateTime(date, time) {
      if (date && time) {
        const dateObj = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);

        dateObj.setHours(hours, minutes, 0, 0);

        return dateObj.toISOString();
      }
      return "";
    },
    async saveTest() {
      const tests = {
        tasks: this.tasks,
        classId: this.selectedClass.id,
        materialId: this.selectedMaterial.id,
        activationTime: this.formattedDateTime(this.activationDate, this.activationTime),
        deactivationTime: this.formattedDateTime(this.deactivationDate, this.deactivationTime)
      }
      const response = await apiService.postAssignment(tests);
      console.log(response);
    },
    updateTask({ taskNumber, updatedData }) {
      console.log("task", taskNumber, "updatedData", updatedData);

      if (updatedData) {
        this.tasks[taskNumber] = updatedData;
      } else {
        console.error("Otrzymano undefined w updatedData");
      }
    }
  },
  computed: {
    isSearchEnabled() {
      return (
        this.selectedClass !== null &&
        this.selectedMaterial !== null &&
        this.positiveNumber > 0)
    },
    filteredMaterials() {
      if (!this.selectedClass) return this.materialsList;

      const filteredMaterials = this.materialsList.filter(
        (item) => item.classYear === this.selectedClass.classYear
      );
      return filteredMaterials;
    }
  }
};
</script>

<style scoped>

.header-container {
  display: flex;
  flex-direction: column; /* Dwie linie */
  width: 100%; /* Wypełnia całą przestrzeń */
  gap: 16px; /* Odstęp między liniami */
}

.first-row {
  display: flex;
  justify-content: space-between; /* Rozmieszczenie: lewa i prawa strona */
  align-items: center;
  width: 100%;
}

.checkbox-right {
  margin-left: auto; /* Checkbox przyklejony do prawej */
}

.second-row {
  display: flex;
  flex-wrap: nowrap; /* Utrzymuje elementy w jednym wierszu */
  width: 100%; /* Cała szerokość komponentu */
}

.left-side {
  flex: 3; /* 60% szerokości (3 z 5 części) */
  padding: 0 8px; /* Odstęp wewnętrzny */
  display: flex;
  flex-direction: row; /* Elementy w jednym wierszu */
  gap: 16px; /* Odstęp między elementami */
}

.right-side {
  flex: 2; /* 40% szerokości */
  padding: 0 8px; /* Odstęp wewnętrzny */
  display: flex;
  flex-direction: row; /* Układ elementów w jednym wierszu */
  gap: 16px; /* Odstęp między polem tekstowym a przyciskiem */
  align-items: center; /* Wyśrodkowanie w pionie */
  justify-content: flex-start; /* Elementy zaczynają od lewej */
}

.number-field {
  flex: 1; /* Pole liczby zajmuje resztę miejsca */
  min-width: 150px; /* Minimalna szerokość pola liczby */
  max-width: 300px; /* Maksymalna szerokość pola liczby */
}

.search-btn {
  white-space: nowrap; /* Zapobiega zawijaniu tekstu */
  flex-shrink: 0; /* Zapobiega ściskaniu przycisku */
  align-self: center; /* Wyrównanie przycisku w pionie */
}

.autocomplete-item {
  flex: 1; /* Elastyczna szerokość pola */
  min-width: 150px; /* Minimalna szerokość */
}

</style>

