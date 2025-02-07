<template>
  <div class="answer-editor">
    <div class="answer-header">
      <label class="answer-label">Odpowiedź</label>
      <button class="add-math-btn" @click="handleAddMathField">
        Dodaj pole matematyczne
      </button>
    </div>
    <!-- Usuwamy wewnętrzny span, operujemy bezpośrednio na divie -->
    <div
      ref="answerDiv"
      class="editable-answer"
      contenteditable="true"
      @blur="handleBlur"
      @focus="setActiveSection"
    ></div>
  </div>
</template>

<script>
import { MathfieldElement } from 'mathlive';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';

export default {
  name: 'AnswerEditor',
  props: {
    answer: { type: String, default: '' }
  },
  data() {
    return {
      answerContent: this.answer,
      activeSection: null
    };
  },
  mounted() {
    // Ustawiamy początkową zawartość jako HTML
    this.$refs.answerDiv.innerHTML = this.answerContent;
  },
  methods: {
    setActiveSection() {
      this.activeSection = 'answer';
    },
    handleBlur(event) {
      // Pobieramy innerHTML, aby zachować elementy (np. mathfield) w treści
      const html = event.target.innerHTML;
      this.answerContent = html;
      this.$emit('update-answer', html);
    },
    handleAddMathField() {
      const mathfield = new MathfieldElement();
      mathfield.classList.add("inline-mathlive");
      mathfield.style.minWidth = '50px';
      mathfield.setValue(''); // lub ustaw wartość startową

      const div = this.$refs.answerDiv;
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0 && div.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);

        // 1. Sprawdzenie i wstawienie spacji przed mathfield, jeśli potrzeba.
        let insertBefore = false;
        if (range.startContainer.nodeType === Node.TEXT_NODE) {
          if (range.startOffset > 0) {
            // Pobieramy znak bezpośrednio przed kursorem.
            const charBefore = range.startContainer.data.charAt(range.startOffset - 1);
            if (!/\s/.test(charBefore)) {
              insertBefore = true;
            }
          } else {
            // Jeśli kursor jest na początku węzła tekstowego, dla pewności wstawimy spację.
            insertBefore = true;
          }
        } else {
          // Jeśli aktualny węzeł nie jest tekstowy, dla bezpieczeństwa ustawiamy spację.
          insertBefore = true;
        }

        if (insertBefore) {
          const spaceBefore = document.createTextNode("\u00A0");
          range.insertNode(spaceBefore);
          // Po wstawieniu spacji przesuwamy zakres za nią.
          range.setStartAfter(spaceBefore);
        }

        // Usuwamy zaznaczenie (jeśli istnieje zaznaczony fragment).
        range.deleteContents();

        // 2. Wstawienie MathfieldElement.
        range.insertNode(mathfield);

        // 3. Sprawdzenie, czy za wstawionym mathfield mamy biały znak.
        let insertAfter = false;
        if (mathfield.nextSibling && mathfield.nextSibling.nodeType === Node.TEXT_NODE) {
          if (mathfield.nextSibling.data.length > 0) {
            // Jeśli pierwszy znak następnego węzła nie jest białym znakiem, wstawiamy spację.
            if (!/^\s/.test(mathfield.nextSibling.data)) {
              insertAfter = true;
            }
          } else {
            insertAfter = true;
          }
        } else {
          // Jeśli nie ma następnego węzła lub nie jest to węzeł tekstowy, wstawiamy spację.
          insertAfter = true;
        }

        if (insertAfter) {
          const spaceAfter = document.createTextNode("\u00A0");
          mathfield.parentNode.insertBefore(spaceAfter, mathfield.nextSibling);
          // Ustawiamy zakres (kursor) za wstawioną spacją.
          range.setStartAfter(spaceAfter);
        } else {
          range.setStartAfter(mathfield);
        }

        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Jeśli nie ma aktywnego zaznaczenia, wstawiamy na końcu.
        let needSpaceBefore = false;
        if (div.lastChild && div.lastChild.nodeType === Node.TEXT_NODE) {
          if (div.lastChild.data.length > 0 && !/\s$/.test(div.lastChild.data)) {
            needSpaceBefore = true;
          }
        } else {
          needSpaceBefore = true;
        }
        if (needSpaceBefore) {
          div.appendChild(document.createTextNode("\u00A0"));
        }
        div.appendChild(mathfield);
        div.appendChild(document.createTextNode("\u00A0"));

        const range = document.createRange();
        range.selectNodeContents(div);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      div.focus();
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
