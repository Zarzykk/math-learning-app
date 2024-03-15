<template>
  <div>
<!--    <VueTiptapKatex-->
<!--    />-->
    <Edit/>
  </div>
</template>

<script>
import Editor from "@/components/editor/Editor.vue";
import Edit from "@/components/editor/Edit.vue";

export default {
  components: {
    Edit,
    Editor,
  },
  data() {
    return {
      content: '',
      edit: null
    };
  },
  methods: {
    async saveContent() {
      if (!this.content.trim()) {
        alert('Treść jest pusta! Proszę wpisać coś przed zapisem.');
        return;
      }
      console.log(this.content);
    },
  },
};
</script>

<style>
/* Stylizacja komponentu */
</style>
