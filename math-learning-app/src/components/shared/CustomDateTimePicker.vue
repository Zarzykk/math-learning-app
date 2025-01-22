<template>
  <v-container>
    <!-- Pole wyboru daty -->
    <v-field
      label="Wybierz datę"
      v-model="date"
      @click:control="dateDialog = true"
    >
      <template #append>
        <v-btn icon variant="text" @click="dateDialog = true">
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </template>
    </v-field>

    <v-dialog v-model="dateDialog" max-width="400px">
      <v-date-picker
        v-model="date"
        @update:model-value="dateDialog = false"
      ></v-date-picker>
    </v-dialog>

    <!-- Pole wyboru godziny -->
    <v-field
      label="Wybierz godzinę"
      v-model="time"
      @click:control="timeDialog = true"
    >
      <template #append>
        <v-btn icon variant="text" @click="timeDialog = true">
          <v-icon>mdi-clock</v-icon>
        </v-btn>
      </template>
    </v-field>

    <v-dialog v-model="timeDialog" max-width="400px">
      <v-time-picker
        v-model="time"
        @update:model-value="timeDialog = false"
        format="24hr"
      ></v-time-picker>
    </v-dialog>

    <!-- Podgląd wybranej daty i godziny -->
    <div class="mt-4">
      <p><strong>Wybrana data:</strong> {{ date }}</p>
      <p><strong>Wybrana godzina:</strong> {{ time }}</p>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      date: null, // Przechowuje wybraną datę
      time: null, // Przechowuje wybraną godzinę
      dateDialog: false, // Dialog wyboru daty
      timeDialog: false, // Dialog wyboru godziny
    };
  },
};
</script>

<style>
/* Możesz dostosować styling w razie potrzeby */
</style>
