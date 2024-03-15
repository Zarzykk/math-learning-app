<template>
  <v-row class="d-flex justify-space-between align-center">
    <v-col cols="4">
      <v-row>
        <span class="text-subtitle-1">Liczba rozwiązanych testów</span>
      </v-row>
      <v-row>
        <span class="text-body-2">{{ completedTests }} / {{ expectedTests }}</span>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-row>
        <span class="text-subtitle-1">Liczba rozwiązanych zadań</span>
      </v-row>
      <v-row>
        <span class="text-body-2">{{ maxPoints }}</span>
      </v-row>
    </v-col>
    <v-row>
      <v-col cols="4">
        <v-row>
          <span class="text-subtitle-1">Data zakończenia</span>
        </v-row>
        <v-row>
          <span class="text-body-2">{{ deactivationTime }}</span>
        </v-row>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
export default {
  name: "StudentBody"
}
</script>

<style scoped>

</style>
