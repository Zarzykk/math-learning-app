<template xmlns="http://www.w3.org/1999/html">
  <BaseModal :visible="visible" @close="handleClose" size="large">
    <template #header>
      <div class="header-container">
        <div class="first-row">
          <v-row>
            <div><span class="text-h5">Tworzenie nowego testu</span></div>
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ props }">
                <v-date-input
                  v-bind="props"
                  :disabled="mode === 'VIEW'"
                  label="Data startu"
                  v-model="activationDate"
                  prepend-icon=""
                  :min="minDate"
                  prepend-inner-icon="$calendar"
                  variant="underlined"
                  @change="saveActivDate"
                  style="max-width: 150px;"
                />
              </template>
              <v-date-picker
                v-model="activationDate"
                :min="minDate"
                style="min-width: 300px;"
              @change="menu1 = false"
              />
            </v-menu>
            <div class="time-picker-container">
              <v-text-field
                v-model="formattedActivationTime"
                variant="underlined"
                prepend-inner-icon="mdi-clock-time-four-outline"
                label="Czas rozpoczęcia"
                placeholder="HH:MM"
                min-width="100px"
                persistent-placeholder
                @blur="validateTimeInput('activation')"
                @input="onTimeInputChange('activation')"
              />
              <v-menu
                v-model="menuActivation"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <v-time-picker
                  v-if="menuActivation"
                  format="24hr"
                  v-model="pickerActivationTime"
                  @change="onTimePickerChange('activation')"
                  full-width
                />
              </v-menu>
            </div>
            <div class="time-picker-container">
              <v-text-field
                v-model="formattedDeactivationTime"
                variant="underlined"
                prepend-inner-icon="mdi-clock-time-four-outline"
                label="Czas zakończenia"
                placeholder="HH:MM"
                min-width="100px"
                persistent-placeholder
                @blur="validateTimeInput('deactivation')"
                @input="onTimeInputChange('deactivation')"
              />
              <v-menu
                v-model="menuDeactivation"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <v-time-picker
                  v-if="menuDeactivation"
                  format="24hr"
                  v-model="pickerDeactivationTime"
                  @change="onTimePickerChange('deactivation')"
                  full-width
                />
              </v-menu>
            </div>
          </v-row>
          <v-checkbox
            v-model="checked"
            v-if="mode === 'ADD'"
            label="Wygeneruj zadania"
            class="checkbox-right">
          </v-checkbox>
        </div>
        <div class="second-row">
          <div class="left-side">
            <v-autocomplete
              :disabled="mode === 'VIEW'"
              v-model="selectedClass"
              :items="classesList"
              class="autocomplete-item"
              label="Wybierz klasę"
              item-title="className"
              item-value="id"
              return-object></v-autocomplete>
            <v-autocomplete
              :disabled="mode === 'VIEW'"
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
          :mode="localMode"
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
      menuActivation: false,
      pickerActivationTime: null,
      formattedActivationTime: '',
      deactivationTime: null,
      menuDeactivation: false,
      pickerDeactivationTime: null,
      formattedDeactivationTime: '',
      time: null,
      menu1: false,
      modal1: false,
      menu2: false,
      modal2: false,
      localMode: this.mode,
      minDate: null,
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
    mode(newVal) {
      this.localMode = newVal;
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
    },
    selectedTest: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.fetchData();
    if (this.selectedTest !== null) {
      this.initializeData(this.selectedTest)
    }
    this.minDate = ref(new Date().toISOString().split('T')[0]);
  },
  methods: {
    async fetchData() {
      try {
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
    async initializeData(testData) {
      console.log('Initializing modal data with:', testData);
      this.selectedMaterial = testData.materialId;
      this.selectedClass = testData.schoolClassId;
      this.tasks.push(...testData.tasks)
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
        const response = await apiService.continueConversation(message, null,"exam");
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

        dateObj.setHours(hours+1, minutes, 0, 0);

        return dateObj.toISOString();
      }
      return "";
    },
    async saveTest() {
      const tests = {
        tasks: this.tasks,
        classId: this.selectedClass.id,
        materialId: this.selectedMaterial.id,
        activationTime: this.formattedDateTime(this.activationDate, this.formattedActivationTime),
        deactivationTime: this.formattedDateTime(this.activationDate, this.formattedDeactivationTime)
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
    },
    validateTimeInput(type) {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      let timeModel, internalModel, pickerModel;

      if (type === 'activation') {
        timeModel = this.formattedActivationTime;
        internalModel = 'activationTime';
        pickerModel = 'pickerActivationTime';
      } else {
        timeModel = this.formattedDeactivationTime;
        internalModel = 'deactivationTime';
        pickerModel = 'pickerDeactivationTime';
      }

      if (timePattern.test(timeModel)) {
        this[internalModel] = timeModel; // Synchronizacja z modelem
        this[pickerModel] = timeModel; // Synchronizacja z pickerem
      } else {
        alert('Nieprawidłowy format czasu. Wprowadź w formacie HH:MM.');
        this[timeModel] = '';
      }
    },

    // Obsługa zmiany czasu w pickerze
    onTimePickerChange(type) {
      let timeModel, internalModel, pickerModel;

      if (type === 'activation') {
        timeModel = 'formattedActivationTime';
        internalModel = 'activationTime';
        pickerModel = 'pickerActivationTime';
        this.menuActivation = false;
      } else {
        timeModel = 'formattedDeactivationTime';
        internalModel = 'deactivationTime';
        pickerModel = 'pickerDeactivationTime';
        this.menuDeactivation = false;
      }

      this[timeModel] = this[pickerModel];
      this[internalModel] = this[pickerModel];
    },

    // Obsługa zmiany czasu w polu tekstowym
    onTimeInputChange(type) {
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      let timeModel, pickerModel;

      if (type === 'activation') {
        timeModel = 'formattedActivationTime';
        pickerModel = 'pickerActivationTime';
      } else {
        timeModel = 'formattedDeactivationTime';
        pickerModel = 'pickerDeactivationTime';
      }

      if (timePattern.test(this[timeModel])) {
        this[pickerModel] = this[timeModel]; // Synchronizacja pickera
      }
    },
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

