<template>
  <transition name="modal-fade">
    <div v-show="visible" class="modal-overlay" @click.self="closeModal">
      <div :class="['modal-content', modalSizeClass]">
        <!-- Nagłówek modalny -->
        <header v-if="$slots.header" class="modal-header">
          <slot name="header"></slot>
        </header>

        <!-- Główna zawartość modalna -->
        <div class="modal-body" ref="bodySlot">
          <slot name="body"></slot>
        </div>

        <!-- Stopka modalna -->
        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div v-if="isWarningModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Ostrzeżenie</h3>
        </div>
        <div class="modal-body">
          <p>Masz niezapisane zmiany. Czy na pewno chcesz zamknąć modal?</p>
        </div>
        <div class="modal-footer">
          <v-btn color="primary" text @click="confirmClose">Tak</v-btn>
          <v-btn color="secondary" text @click="cancelClose">Nie</v-btn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isWarningModalOpen: false,
      hasUnsavedChanges: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator(value) {
        return ['small', 'medium', 'large', 'full'].includes(value);
      },
    }
  },
  computed: {
    modalSizeClass() {
      return `modal-${this.size}`;
    }
  },
  methods: {
    closeModal() {
        this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Ciemne, półprzezroczyste tło */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ustaw wysoki z-index, aby overlay był nad innymi elementami */
}

/* Stylowanie modala */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  transform: translateY(0);
  opacity: 100;
  transition: transform 0.3s ease, opacity 0.3s ease;
  height: 85vh;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap; /* Opcjonalne: pozwala zawijać, jeśli zabraknie miejsca */
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  align-items: center;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.modal-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.modal-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}


.modal-small {
  width: 40%;
  max-width: none;
}

.modal-medium {
  width: 60%;
  max-width: none;
}

.modal-large {
  width: 75%;
  max-width: none;
}

.modal-full {
  width: 90%;
  max-width: none;
}
</style>
