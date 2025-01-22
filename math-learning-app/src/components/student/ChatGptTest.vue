<template>
  <div class="app-container">
    <h1>Edytor Treści z MathLive</h1>
    <MathliveTextEditor
      :task-content="editorContent"
      @update:modelValue="updateEditorContent"
      :width="'500px'"
      :height="'200px'"
      :task-number="'1'"
      :editable="true"
    />
    <v-btn color="primary" @click="saveContentToAPI" class="save-button">
      Zapisz Treść
    </v-btn>
  </div>
</template>

<script>
import MathliveTextEditor from './MathliveTextEditor.vue'; // Import naszego komponentu edytora

export default {
  name: 'App',
  components: {
    MathliveTextEditor,
  },
  data() {
    return {
      editorContent: '', // Początkowa zawartość pobrana z API
    };
  },
  methods: {
    async fetchContentFromAPI() {
      this.editorContent = 'Oblicz: $x^2 + y^2 = z^2$.';
    },

    updateEditorContent(newContent) {
      this.editorContent = newContent; // Treść edytora jest synchronizowana
    },

    // Symulacja zapisywania do API
    async saveContentToAPI() {
      console.log('Zapisuję do API:', this.editorContent);

      // Zastąp to rzeczywistym zapytaniem do API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });

      if (response.success) {
        alert('Treść została zapisana!');
      }
    },
  },
  mounted() {
    // Pobierz dane z API przy ładowaniu komponentu
    this.fetchContentFromAPI();
  },
};
</script>

<!--<script setup lang="ts">-->
<!--import { ref } from "vue";-->
<!--import MyCustomTextArea from './MyCustomTextArea.vue';-->

<!--const text = ref('')-->

<!--function onBlurHandler(value: string) {-->
<!--  console.log('Zawartość pola po blur:', value)-->
<!--}-->
<!--</script>-->

<style scoped>

</style>
