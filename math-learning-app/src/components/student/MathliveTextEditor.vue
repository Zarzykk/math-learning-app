<template>
  <div :class="['mathlive-text-editor', { 'editable-active': isEditable }]"
       :style="{ width: width, height: height }">
    <div class="header-container">
      <div class="task-number" v-if="taskNumber">Zadanie {{ taskNumber + 1 }}</div>
      <div v-else class="task-placeholder"></div>
      <div class="button-container">
        <v-btn
          icon
          @click="toggleEditMode"
          :title="isEditable ? 'Wyłącz edycje' : 'Włącz edycje'"
          class="custom-button"
        >
          <v-icon>{{ isEditable ? 'mdi-pencil-off' : 'mdi-pencil' }}</v-icon>
        </v-btn>
        <v-btn
          icon
          :title="'Inny przycisk (akcja do dodania)'"
          class="custom-button"
          :disabled="!isEditable"
        >
          <v-icon>mdi-information</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="addMathField"
          :title="'Dodaj MathField'"
          class="custom-button"
          :disabled="!isEditable"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div
      ref="editableDiv"
      class="editable-div"
      :contenteditable="isEditable"
      @focus="setActiveSection('content')"
    ></div>
    <div
      ref="answerDiv"
      class="answer-div"
      :contenteditable="isEditable"
      @focus="setActiveSection('answer')"
    >
      <span class="answer-label" contenteditable="false">Odpowiedź: </span>
    </div>
  </div>
</template>

<script>
import {MathfieldElement} from 'mathlive';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'MathliveTextEditor',
  props: {
    taskContent: {
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
    taskNumber: {
      type: Number,
      default: null, // Numer zadania jest opcjonalny
    }
  },
  data() {
    return {
      isEditable: this.editable,
      activeSection: null,
    };
  },
  methods: {
    loadContentFromAPI(data) {
      const contentDiv = this.$refs.editableDiv;
      const answerDiv = this.$refs.answerDiv;

      if (!contentDiv || !answerDiv) {
        console.error("Nie udało się odnaleźć elementów referencji (refs).");
        return;
      }

      // Przetwarzanie treści
      const processedContent = data.content.replace(
        /\$\$([^$]+)\$\$|\$([^$]+)\$/g,
        (_, blockMath, inlineMath) => {
          const latex = blockMath || inlineMath;
          return `<math-field>${latex}</math-field>`;
        }
      );

      // Przetwarzanie odpowiedzi
      const processedAnswer = data.answer.replace(
        /\$\$([^$]+)\$\$|\$([^$]+)\$/g,
        (_, blockMath, inlineMath) => {
          const latex = blockMath || inlineMath;
          return `<math-field>${latex}</math-field>`;
        }
      );

      // Ustaw zawartość w divach
      contentDiv.innerHTML = processedContent;
      answerDiv.innerHTML = `<span class="answer-label" contenteditable="false">Odpowiedź:</span> ${processedAnswer}`;

      // Przetwarzanie math-field
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

      if (this.isEditable) {
        span.classList.add("editable");
      } else {
        span.classList.add("disabled");
      }

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
    setActiveSection(section) {
      this.activeSection = section;
    },
    addMathField() {
      const mathfield = new MathfieldElement();
      mathfield.classList.add("inline-mathlive");
      mathfield.setValue("");

      const div = this.activeSection === "answer" ?
        this.$refs.answerDiv : this.$refs.editableDiv
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
    taskContent: {
      immediate: true,
      handler(newContent) {
        if (newContent) {
          this.$nextTick(() => {
          this.loadContentFromAPI(newContent);
          })
        }
      },
    },
    isEditable(newVal) {
      const katexDisplays = this.$refs.editableDiv.querySelectorAll(".katex-display");

      katexDisplays.forEach((span) => {
        span.classList.remove("editable", "disabled");

        if (newVal) {
          span.classList.add("editable");
        } else {
          span.classList.add("disabled");
        }
      })
    }
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
  background-color: #f0f0f0; /* Szary domyślnie (zablokowana edycja) */
  padding: 4px;
  transition: background-color 0.3s, border-color 0.3s;
}

.mathlive-text-editor.editable-active {
  background-color: #ffffff; /* Białe tło przy włączonej edycji */
  border-color: #ffcc00; /* Dodatkowe podkreślenie w trybie edycji */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 8px; /* Mniejsze marginesy */
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
}

.task-number {
  font-weight: bold;
  font-size: 16px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.answer-label {
  font-weight: bold;
  margin-right: 4px;
  pointer-events: none; /* Wyłącza interakcje użytkownika */
  user-select: none; /* Wyłącza możliwość zaznaczania tekstu */
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
  font-size: 16px;
  vertical-align: middle;

  /* Domyślny styl dla nieedytowalnego komponentu */
  background-color: transparent;
  border: none;
  cursor: default;
  color: inherit; /* Dopasowuje kolor tekstu */
}

.katex-display.editable {
  cursor: pointer;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.katex-display.disabled {
  background-color: #f0f0f0;
  border: none; /* Brak obramowania */
  cursor: default;
}

.inline-mathlive {
  display: inline-block;
  margin: 0 4px;
  vertical-align: middle;
  font-size: 16px;
}
</style>
