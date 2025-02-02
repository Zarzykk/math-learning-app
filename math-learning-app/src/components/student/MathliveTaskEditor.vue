<template>
  <div :class="['mathlive-task-editor']" :style="{ width: width, height: height }">
    <!-- Sekcja informacji o zadaniu -->
    <div class="task-info">
      <div class="task-content">
        <!-- Wyświetlamy treść zadania po przetworzeniu wzorów matematycznych -->
        <span v-html="renderedContent"></span>
      </div>
      <div class="task-points">
        <strong>Punkty:</strong> {{ points }}
      </div>
    </div>
    <!-- Sekcja edycji odpowiedzi -->
    <div class="answer-editor">
      <div class="answer-header">
        <v-btn
          icon
          @click="addMathField"
          :title="'Dodaj MathField'"
          class="custom-button"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <div
        ref="answerDiv"
        class="editable-answer"
        contenteditable="true"
        @blur="updateAnswer($event)"
        @focus="setActiveSection('answer')"
      >
        <span class="answer-label" contenteditable="false">Odpowiedź: </span>
        <!-- Wyświetlamy przetworzoną odpowiedź -->
        <span v-html="renderedAnswer"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { MathfieldElement } from 'mathlive';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'MathliveTaskEditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    answer: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      activeSection: null
    };
  },
  computed: {
    // Przetwarzamy treść zadania, zamieniając fragmenty typu $...$ lub $$...$$ na elementy <math-field>
    renderedContent() {
      return this.processText(this.content);
    },
    // Analogicznie przetwarzamy odpowiedź
    renderedAnswer() {
      return this.processText(this.answer);
    }
  },
  methods: {
    processText(text) {
      return text.replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_, blockMath, inlineMath) => {
        const latex = blockMath || inlineMath;
        return `<math-field>${latex}</math-field>`;
      });
    },
    // Przetwarzamy wszystkie elementy <math-field> w danym polu i zamieniamy je na widoki KaTeX
    convertMathFields(field) {
      const mathFields = field.querySelectorAll('math-field');
      mathFields.forEach((mathfield) => {
        const latex = mathfield.textContent;
        this.convertMathfieldToDisplay(mathfield, latex);
      });
    },
    convertMathfieldToDisplay(mathfield, latex) {
      const span = document.createElement('span');
      span.classList.add('katex-display');
      // Ponieważ komponent zawsze jest edytowalny, przypisujemy klasę 'editable'
      span.classList.add('editable');

      katex.render(latex, span, {
        throwOnError: false
      });

      // Po kliknięciu konwertujemy widok KaTeX z powrotem na MathField
      span.addEventListener('click', () => {
        this.convertDisplayToMathfield(span, latex);
      });

      mathfield.replaceWith(span);
    },
    convertDisplayToMathfield(span, latex) {
      const mathfield = new MathfieldElement();
      mathfield.setValue(latex);
      mathfield.classList.add('inline-mathlive');

      span.replaceWith(mathfield);

      mathfield.addEventListener('blur', () => {
        this.convertMathfieldToDisplay(mathfield, mathfield.getValue());
      });

      mathfield.focus();
    },
    setActiveSection(section) {
      this.activeSection = section;
    },
    updateAnswer(event) {
      let updatedValue = event.target.innerText;
      if (updatedValue.startsWith("Odpowiedź:")) {
        updatedValue = updatedValue.replace("Odpowiedź:", "").trim();
      }
      this.$emit('update-answer', updatedValue);
    },
    addMathField() {
      const mathfield = new MathfieldElement();
      mathfield.classList.add("inline-mathlive");
      mathfield.setValue("");

      const div = this.$refs.answerDiv;
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && div.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(mathfield);
        const textNode = document.createTextNode("\u00A0");
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        div.appendChild(mathfield);
        const textNode = document.createTextNode("\u00A0");
        div.appendChild(textNode);
        const range = document.createRange();
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      mathfield.addEventListener("blur", () => {
        this.convertMathfieldToDisplay(mathfield, mathfield.getValue());
      });

      mathfield.focus();
    },
    processAllMathFields() {
      if (this.$refs.answerDiv) {
        this.convertMathFields(this.$refs.answerDiv);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.processAllMathFields();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.processAllMathFields();
    });
  }
};
</script>

<style scoped>
.mathlive-task-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  padding: 8px;
  transition: background-color 0.3s, border-color 0.3s;
}
.task-info {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.task-content {
  flex: 9;
  font-size: 18px;
  line-height: 1.5;
  margin: 0;
}
.task-points {
  flex: 1;
  text-align: right;
  line-height: 1.5;
  margin: 0;
}
.answer-editor {
  border-top: 1px solid #ccc;
  padding-top: 8px;
}
.answer-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}
.custom-button {
  width: 40px;
  height: 40px;
}
.editable-answer {
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
}
.katex-display {
  display: inline-block;
  margin: 0 4px;
  padding: 2px 4px;
  font-size: 16px;
  vertical-align: middle;
  border: 1px solid #ccc;  /* Obramowanie 1px, kolor można dostosować */
  width: auto;             /* Element zajmuje tylko tyle miejsca, ile potrzebuje */
  box-sizing: border-box;
}
.katex-display.editable {
  cursor: pointer;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.inline-mathlive {
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
  font-size: 16px;
}
</style>
