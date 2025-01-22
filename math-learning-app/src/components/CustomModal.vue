<template>
  <BaseModal :visible="visible" @close="handleClose" size="medium">
    <template #header>

    </template>

    <template #footer>
      <button @click="handleClose">Zamknij</button>
      <button @click="handleAction">Inna Akcja</button>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './shared/BaseModal.vue';

export default {
  components: {
    BaseModal
  },
  props: {
    visible: Boolean
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleAction() {
      console.log("Akcja w modalu!");
    }
  }
};
</script>
