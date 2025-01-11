<template>
  <div class="mathlive-text-editor" :style="{ width: width, height: height }">
    <div class="button-container">
      <v-btn icon @click="toggleEditMode"
             :title="isEditable ? 'Wyłącz edycje' : 'Włącz edycje'"
             class="custom-button">
        <v-icon class="custom-icon">{{ isEditable ? 'mdi-pencil-off' : 'mdi-pencil' }}</v-icon>
      </v-btn>
      <v-btn icon
             class="custom-button"
             :title="'Inny przycisk (akcja do dodania)'">
        <v-icon class="custom-icon">mdi-information</v-icon>
      </v-btn>
      <v-btn icon @click="addMathField"
             :tile="'Dodaj pole matematyczne'"
             class="custom-button">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div
      ref="editableDiv"
      class="editable-div"
      :contenteditable="isEditable"
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
    toggleEditMode() {
      this.isEditable = !this.isEditable;
    },
    addMathField() {
      const mathfield = new MathfieldElement();
      mathfield.classList.add("inline-mathlive");
      mathfield.setValue(""); // Możesz ustawić tutaj domyślną wartość

      // Dodajemy Mathfield do kursora lub na końcu
      const div = this.$refs.editableDiv;
      const selection = window.getSelection();

      if (
        selection &&
        selection.rangeCount > 0 &&
        div.contains(selection.anchorNode)
      ) {
        // Wstaw w miejscu kursora
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(mathfield);

        // Ustaw kursor za nowo dodanym Mathfield
        const textNode = document.createTextNode("\u00A0"); // Dodajemy pusty znak (spację)
        range.insertNode(textNode); // Wstawiamy znak po Mathfield
        range.setStartAfter(textNode); // Ustawiamy kursor za spacją
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Jeśli nie ma kursora, dodaj na końcu
        div.appendChild(mathfield);
        const textNode = document.createTextNode("\u00A0"); // Dodajemy pusty znak (spację)
        div.appendChild(textNode);

        // Ustawiamy kursor za spacją
        const range = document.createRange();
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Dodajemy obsługę po opuszczeniu (blur)
      mathfield.addEventListener("blur", () => {
        this.convertMathfieldToDisplay(mathfield, mathfield.getValue());
      });

      // Ustawiamy fokus na nowo dodanym Mathfield
      mathfield.focus();
    }
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
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  padding: 4px 8px; /* Mniejsze marginesy */
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
}

.custom-button {
  width: 60px !important; /* Szerokość przycisków */
  height: 25px !important; /* Wysokość przycisków */
  border-radius: 4px !important; /* Prostokątny kształt */
  padding: 0 !important; /* Usuń marginesy wewnętrzne */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: unset !important; /* Usuń minimalną szerokość domyślną Vuetify */
}

.custom-icon {
  font-size: 18px !important; /* Zmniejsz rozmiar ikon */
}

.editable-div {
  flex-grow: 1;
  padding: 8px;
  overflow: auto;
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
