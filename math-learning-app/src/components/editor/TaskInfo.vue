<template>
  <div class="task-info">
    <div class="task-content">
      <span v-html="renderedContent"></span>
    </div>
    <div class="task-points">
      <strong>Punkty:</strong> {{ points }}
    </div>
  </div>
</template>

<script>
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: "TaskInfo",
  props: {
    content: {
      type: String,
      default: ''
    },
    points: {
      type: Number,
      default: 0
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
