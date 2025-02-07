<template>
  <div :class="['mathlive-task-editor']" :style="{ width: width, height: height }">
    <div class="task-info">
      <div class="task-content">
        <span v-html="renderedContent"></span>
      </div>
      <div class="task-points">
        <strong>Punkty:</strong> {{ points }}
      </div>
    </div>
    <div class="answer-editor">
      <div class="answer-header">
        <label class="answer-label">Odpowiedź</label>
        <v-btn
          @click="addMathField"
          :title="'Dodaj pole matematyczne'"
          class="add-math-btn"
        >
          Dodaj pole matematyczne
        </v-btn>
      </div>
      <div
        ref="answerDiv"
        class="editable-answer"
        contenteditable="true"
        @blur="updateAnswer($event)"
        @focus="setActiveSection('answer')"
      >
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
      span.classList.add('editable');

      katex.render(latex, span, {
        throwOnError: false
      });

      const width = mathfield.offsetWidth;
      span.style.width = (width + 5) + 'px';

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
      // Jeśli zawiera nadmiarowy tekst – usuń go
      if (updatedValue.startsWith("Odpowiedź:")) {
        updatedValue = updatedValue.replace("Odpowiedź:", "").trim();
      }
      this.$emit('update-answer', updatedValue);
    },
    addMathField() {
      const mathfield = new MathfieldElement();
      mathfield.classList.add("inline-mathlive");
      mathfield.style.minWidth='50px'
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
  flex: 0 0 auto;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 1px;
  margin-left: 1px;
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
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-top: 1px solid #ccc;
  padding-top: 8px;
}
.answer-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  margin-right: 1px;
  margin-left: 1px;
}
.custom-button {
  width: 40px;
  height: 40px;
}
.answer-label {
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
}
.editable-answer {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.add-math-btn {
  border-radius: 4px;
  padding: 6px 12px;
  text-transform: none;
}
.katex-display {
  display: inline-block;
  vertical-align: baseline; /* wyrównanie do linii bazowej tekstu */
  margin: 0 2px;           /* mniejsze odstępy po bokach */
  padding: 0 2px;          /* delikatny padding, by tekst nie przylegał bezpośrednio do krawędzi */
  font-size: 1em;          /* rozmiar zgodny z otaczającym tekstem */
  line-height: 1;          /* opcjonalnie, by lepiej dopasować wysokość */
  border: 1px solid transparent; /* domyślnie niewidoczne obramowanie */
  box-sizing: border-box;
}
.katex-display.editable {
  cursor: pointer;
  background-color: #fdfdfd; /* bardzo jasne tło */
  border: 1px solid #ccc;    /* delikatne obramowanie */
  border-radius: 3px;        /* zaokrąglone rogi */
  padding: 0 2px;           /* utrzymujemy podobny padding */
}

.inline-mathlive {
  display: inline-block;
  vertical-align: baseline;
  margin: 0 2px;
  font-size: 1em;
  line-height: 1;
}
</style>
