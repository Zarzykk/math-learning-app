<template>
  <v-container class="task-container">
    <v-row class="task-title">
      <span>Zadanie {{ index + 1 }}</span>
    </v-row>
    <v-row class="task-content">
      <span ref="math">{{ content }}</span>
    </v-row>
    <v-row class="task-answer" v-if="answer!==null">
      Odpowiedź: <span ref="math"> {{ answer }}</span>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    index: Number,
    content: String,
    answer: String
  },
  mounted() {
    this.renderMath();
  },
  updated() {
    this.renderMath();
  },
  methods: {
    renderMath() {
      if (window.MathJax) {
        window.MathJax.typesetPromise([this.$refs.math]).catch((err) =>
          console.error('MathJax render error:', err)
        );
      } else {
        console.warn('MathJax is not yet loaded. Retrying...');
        setTimeout(this.renderMath, 500);
      }
    }
  }
}
</script>

<style>
.task-container {
  font-family: 'Arial', sans-serif;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.task-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.task-content {
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
}

.task-answer {
  font-size: 18px;
  font-weight: bold;
  color: #000;
}

.task-answer span {
  font-style: italic;
  color: #007bff;
}
</style>
