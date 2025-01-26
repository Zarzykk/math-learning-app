<template>
  <BaseDashboard>
    <v-autocomplete
      v-model="selectedClass"
      :items="allClasses"
      class="autocomplete-item"
      label="Wybierz klasę"
      item-title="className"
      item-value="id"
      return-object>
    </v-autocomplete>
    <v-text-field
      v-model="firstName"
      label="Imię"
      required
    >
    </v-text-field>
    <v-text-field
      v-model="lastName"
      label="Nazwisko"
      required
    >
    </v-text-field>
    <v-text-field
      v-model="email"
      label="E-mail"
      required
    >
    </v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      label="Hasło"
      required
    >
    </v-text-field>
    <v-btn @click="postStudent()">Dodaj ucznia</v-btn>
  </BaseDashboard>
</template>

<script>
import BaseDashboard from "@/components/shared/BaseDashboard.vue";
import apiService from "@/services/apiService";

export default {
  name: "StudentsManage",
  components: {BaseDashboard},
  data() {
    return {
      allClasses: [],
      selectedClass: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null
    }
  },
  mounted() {
   this.fetchClasses()
  },
  methods: {
    async postStudent() {
      const studentData = {
        email: this.email,
        password: this.password,
        classId: this.selectedClass.id,
        firstName: this.firstName,
        lastName: this.lastName
      }
      await apiService.postStudent(studentData);
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
  },
}
</script>
<style scoped>

</style>
