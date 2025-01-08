<template>
  <div
    class="mathlive-text-editor"
    :style="{ width: width, height: height, overflow: 'auto' }"
  >
    <div
      ref="editableDiv"
      class="editable-div"
      contenteditable="isEditable"
    ></div>
  </div>
</template>

<script>
import {MathfieldElement} from 'mathlive';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'MathliveTextEditor',
  props: {
    apiContent: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '100%', // Domyślna szerokość komponentu
    },
    height: {
      type: String,
      default: '200px', // Domyślna wysokość komponentu
    },
    editable: {
      type: Boolean,
      default: true, // Określa, czy komponent jest edytowalny
    },
  },
  data() {
    return {
      isEditable: this.editable, // Zmienna wewnętrzna do przełączania edycji
    };
  },
  methods: {
    loadContentFromAPI(content) {
      const div = this.$refs.editableDiv;

      // Rozpoznaj fragmenty LaTeX (np. $...$ lub $$...$$) i zamień je na <math-field>
      const processedContent = content.replace(
        /\$\$([^$]+)\$\$|\$([^$]+)\$/g,
        (_, blockMath, inlineMath) => {
          const latex = blockMath || inlineMath;
          // Zamień LaTeX na <math-field>
          return `<math-field>${latex}</math-field>`;
        }
      );

      // Ustaw przetworzoną treść w div
      div.innerHTML = processedContent;

      // Przetwórz <math-field> na komponenty edytowalne lub wyświetlane
      this.processMathFields();
    },
    processMathFields() {
      const div = this.$refs.editableDiv;

      // Znajdź wszystkie <math-field>
      const mathFields = div.querySelectorAll('math-field');

      mathFields.forEach((mathfield) => {
        const latex = mathfield.textContent;

        // Zamień MathLive na wyświetlający KaTeX
        this.convertMathfieldToDisplay(mathfield, latex);
      });
    },
    convertMathfieldToDisplay(mathfield, latex) {
      const span = document.createElement('span');
      span.classList.add('katex-display');
      katex.render(latex, span, {
        throwOnError: false,
      });

      span.addEventListener('click', () => {
        if (this.isEditable) {
          this.convertDisplayToMathfield(span, latex);
        }
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
  },
  watch: {
    apiContent: {
      immediate: true,
      handler(newContent) {
        if (newContent) {
          this.loadContentFromAPI(newContent);
        }
      },
    },
  },
};
</script>


<style>
.mathlive-text-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
}

.editable-div {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  min-height: 100%;
  outline: none;
  white-space: pre-wrap;
}

.katex-display {
  display: inline-block;
  margin: 0 4px;
  padding: 2px 4px;
  cursor: pointer;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  vertical-align: middle;
}

.inline-mathlive {
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
  font-size: 16px;
}
</style>
