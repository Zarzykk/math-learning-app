<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Edytor matematycznego zadania</v-card-title>
      <v-card-text>
        <!-- Pole edycji -->
        <textarea
          v-if="isEditable"
          v-model="task"
          class="editable-textarea"
          placeholder="Napisz swoje zadanie matematyczne, używając LaTeX, np. \\(a^2 + b^2 = c^2\\)"
        ></textarea>

        <!-- Podgląd (renderowany zawsze, ale ukrywany w trybie edycji) -->
        <div
          ref="taskPreview"
          v-show="!isEditable"
          class="task-preview"
        ></div>

        <!-- Przycisk przełączający tryb -->
        <v-btn @click="toggleEditMode" color="primary" class="mt-4">
          {{ isEditable ? "Zapisz zadanie" : "Edytuj zadanie" }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container>
    <h1>Rysowanie na Canvas 🎨</h1>
    <drawing-canvas/>
  </v-container>
</template>

<script>
import { renderMathInElement } from "mathlive";
import DrawingCanvas from "@/components/editor/DrawingCanvas.vue";

export default {
  components: {
    DrawingCanvas,
  },
  data() {
    return {
      task: "Oblicz wartość \\( a^2 + b^2 \\) dla \\( a = 3 \\) i \\( b = 4 \\).", // Tekst zadania z LaTeX
      isEditable: true, // Flaga wskazująca tryb edycji
    };
  },
  methods: {
    toggleEditMode() {
      if (this.isEditable) {
        // Po zakończeniu edycji renderujemy podgląd
        this.renderTask();
      }
      this.isEditable = !this.isEditable;
    },
    renderTask() {
      const container = this.$refs.taskPreview;
      if (container) {
        container.innerHTML = this.task; // Wstawiamy zadanie jako HTML

        // Renderujemy LaTeX w podglądzie
        renderMathInElement(container, {
          delimiters: [
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
        });
      }
    },
  },
};
</script>

<style scoped>
.editable-textarea {
  width: 100%;
  height: 200px;
  font-size: 16px;
  font-family: "Courier New", Courier, monospace;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.task-preview {
  font-size: 16px;
  line-height: 24px;
}
</style>
