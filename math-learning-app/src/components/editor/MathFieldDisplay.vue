<template>
  <!-- Ten komponent renderuje LaTeX za pomocą KaTeX i jest statyczny -->
  <span class="katex-display" v-html="renderedLatex"></span>
</template>

<script>
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: "MathFieldDisplay",
  props: {
    latex: {type: String, required: true}
  },
  computed: {
    renderedLatex() {
      try {
        return katex.renderToString(this.latex, {throwOnError: false});
      } catch (e) {
        return this.latex;
      }
    }
  }
}
</script>

<style scoped>
.katex-display {
  display: inline-block;
  vertical-align: baseline;
  margin: 0 2px;
  padding: 0 2px;
  font-size: 1em;
  line-height: 1;
  border: 1px solid transparent;
  box-sizing: border-box;
}
</style>
