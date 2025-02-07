<template>
  <div class="mathlive-task-editor" :style="{ width: width, height: height }">
    <TaskInfo :content="content" :points="points"/>
    <AnswerEditor
      :answer="answer"
      @update-answer="updateAnswer"/>
  </div>
</template>

<script>
import TaskInfo from './TaskInfo.vue';
import AnswerEditor from './AnswerEditor.vue';

export default {
  name: "FullComponent",
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
</style>
