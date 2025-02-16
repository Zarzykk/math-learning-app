<template>
  <div class="mathlive-task-editor" :style="{ width: width, height: height }">
    <div class="task-info">
      <div class="task-content">
        <span v-html="renderedContent"></span>
      </div>
      <div></div>
      <div class="task-points">
        <strong>Punkty:</strong> {{ points }}
      </div>-
    </div>
    <AnswerEditor
      :answer="answer"
      @update-answer="updateAnswer"/>
  </div>
</template>

<script>
import TaskInfo from './TaskInfo.vue';
import AnswerEditor from './AnswerEditor.vue';
import katex from "katex";

export default {
  name: "FullComponentEditable",
  components: {TaskInfo, AnswerEditor},
  props: {
    content: {type: String, default: ''},
    answer: {type: String, default: ''},
    points: {type: Number, default: 0},
    width: {type: String, default: '100%'},
    height: {type: String, default: '300px'}
  },
  methods: {
    updateAnswer(newAnswer) {
      this.$emit('update-answer', newAnswer);
    }
  },
  computed: {
    renderedContent() {
      return this.content.replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_, blockMath, inlineMath) => {
        const latex = blockMath || inlineMath;
        try {
          return katex.renderToString(latex, {throwOnError: false});
        } catch (e) {
          return latex;
        }
      });
    }
  }
}
</script>

<style scoped>
.mathlive-task-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  padding: 8px;
  box-sizing: border-box;
  height: 100%;
}

.task-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.task-content {
  flex: 9;
  font-size: 18px;
  line-height: 1.5;
}

.task-points {
  flex: 1;
  text-align: right;
  font-size: 16px;
}
</style>
