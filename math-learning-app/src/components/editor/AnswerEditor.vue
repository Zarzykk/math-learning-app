<template>
  <div class="answer-editor">
    <div class="answer-header">
      <label class="answer-label">Odpowiedź</label>
      <button class="add-math-btn" @click="handleAddMathField">
        Dodaj pole matematyczne
      </button>
    </div>
    <!-- Edytowalna strefa, która nie przekracza rozmiaru komponentu -->
    <div
      ref="answerDiv"
      class="editable-answer"
      contenteditable="true"
      @blur="handleBlur"
      @focus="setActiveSection"
    >
      <!-- Wyświetlamy treść edytowaną – można tutaj przetwarzać zawartość i zamieniać fragmenty na MathFieldDisplay -->
      <span v-html="answerContent"></span>
    </div>
  </div>
</template>

<script>
import { MathfieldElement } from 'mathlive';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'AnswerEditor',
  props: {
    answer: {type: String, default: ''}
  },
  data() {
    return {
      answerContent: this.answer,
      activeSection: null
    };
  },
  methods: {
    setActiveSection() {
      this.activeSection = 'answer';
    },
    handleBlur(event) {
      const text = event.target.innerText;
      this.answerContent = text;
      this.$emit('update-answer', text);
    },
    handleAddMathField() {
      const mathfield = new MathfieldElement();
      mathfield.classList.add("inline-mathlive");
      mathfield.style.minWidth = '50px';
      mathfield.setValue('');

      const div = this.$refs.answerDiv;
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && div.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const spaceBefore = document.createTextNode("\u00A0");
        range.insertNode(spaceBefore);

        range.collapse(false);
        range.insertNode(mathfield);

        range.collapse(false);
        const spaceAfter = document.createTextNode("\u00A0");
        range.insertNode(spaceAfter);

        range.setStartAfter(spaceAfter);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const spaceBefore = document.createTextNode("\u00A0");
        const spaceAfter = document.createTextNode("\u00A0");
        div.appendChild(spaceBefore);
        div.appendChild(mathfield);
        div.appendChild(spaceAfter);
      }
      mathfield.focus();
    }
  }
};
</script>


<style scoped>
.answer-editor {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;
  padding-top: 8px;
  flex: 1;
  overflow: hidden;
}

.answer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.answer-label {
  font-weight: bold;
  margin: 0;
}

.add-math-btn {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 12px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.editable-answer {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 80px;
}
</style>
