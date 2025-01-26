<template>
    <v-row class="d-flex justify-space-between align-center">
      <v-col cols="4">
        <v-row>
          <span class="text-subtitle-1">Liczba rozwiązanych prac</span>
        </v-row>
        <v-row>
          <span class="text-body-2">{{ completedAssignments }} / {{ expectedAssignments }}</span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <span class="text-subtitle-1">Punkty</span>
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
  props: {
    completedAssignments: Number,
    expectedAssignments: Number,
    maxPoints: Number,
    deactivationTime: String
  }
}
</script>

<style scoped>

</style>
