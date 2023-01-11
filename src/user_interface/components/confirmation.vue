<template>
  <b-modal
    class="confirmation"
    ref="confirmation"
    hide-footer
    centered
    modal-header-close="X"
    hide-header
    @hide="onCancel"
  >
    <Close class="confirmation-close-icon" @click="onCancel" />
    <div class="confirmation-title font-subtitle">{{ title }}</div>
    <div class="confirmation-content font-normal-3">{{ content }}</div>
    <div class="confirmation-buttons">
      <b-button
        class="confirmation-button button-1 font-normal-3"
        @click="onAccept"
        >{{ accept }}</b-button
      >
      <b-button
        class="confirmation-button button-1 font-normal-3"
        @click="onCancel"
        >{{ cancel }}</b-button
      >
    </div>
  </b-modal>
</template>

<script>
/**
 * Estructura de notificaciones
 *
 * @module confirmation
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import Close from "vue-material-design-icons/Close.vue";

export default {
  name: "confirmation",
  props: ["showConfirmation", "title", "content", "accept", "cancel"],
  components: { Close },
  data() {
    return {};
  },
  methods: {
    onCancel() {
      this.showConfirmation.show = false;
    },
    onAccept() {
      this.$emit("onAccept");
      this.showConfirmation.show = false;
    }
  },
  watch: {
    // Acualizar ficha al detectar cambios en el Json de la ficha.
    showConfirmation: {
      deep: true,
      handler(newCount, oldCount) {
        // Si se deben mostrar los controles
        if (newCount.show) {
          this.$refs.confirmation.show();
        } else {
          this.$refs.confirmation.hide();
        }
      }
    }
  }
};
</script>

<style>
.modal-content {
  background-color: var(--background-color-5);
  box-shadow: 0px 4px 15px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px !important;
  border-radius: 0px;
  left: calc(50% - 360px / 2);
  top: calc(50% - 168px / 2);
  width: 360px;
  height: 168px;
  border: 0px;
  border-radius: 10px;
}

.modal-body {
  width: 360px;
  height: 168px;
  border: 0px;
  background: var(--background-color-5) !important;
  border-radius: 10px !important;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

@media only screen and (max-width: 768px) {
  .modal-content {
    width: 300px;
    left: calc(50% - 300px / 2);
    top: calc(50% - 150px / 2);
  }
  .modal-body {
    width: 300px;
  }
}

.confirmation {
  background: var(--background-color-5) !important;
  box-shadow: 0px 4px 15px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.confirmation-close-icon {
  position: absolute;
  left: calc(100% - 25px);
  top: 1px;
  color: var(--text-color-2);
}
.confirmation-title {
  color: var(--text-color-4);
}
.confirmation-content {
  color: var(--text-color-1);
}
.confirmation-close-icon:hover {
  cursor: pointer;
  color: var(--text-color-3);
}
.confirmation-content {
  text-align: center;
}
.confirmation-button {
  margin-left: 10px;
  margin-right: 10px;
  padding-left: 30px;
  padding-right: 30px;
}
</style>
