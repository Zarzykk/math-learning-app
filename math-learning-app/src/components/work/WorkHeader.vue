<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-row>
          <span class="text-h6">Klasa</span>
        </v-row>
        <v-row>
          <span class="text-body-1">{{ className }}</span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <span class="text-h6">Temat</span>
        </v-row>
        <v-row>
          <span class="text-body-1">{{ materialName }}</span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <span class="text-h6">Data uruchomienia</span>
        </v-row>
        <v-row>
          <span class="text-body-1">{{ startDate }}</span>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  props: {
    className: String,
    materialName: String,
    startDate: String
  }
}

</script>

<style>

</style>
