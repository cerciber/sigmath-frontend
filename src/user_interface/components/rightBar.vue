<template>
  <!-- Barra lateral derecha -->
  <div>
    <!-- Barra de caracteristicas de la ficha -->
    <b-tab
      :title="
        $store.state.mathpad.selectedCard
          ? $store.state.mathpad.selectedCard.title.trim() !== ''
            ? $store.state.mathpad.selectedCard.title
            : 'Sin nombre'
          : 'Sin seleccionar'
      "
      :title-link-class="'left-bar-tab'"
    >
      <cardFeatures></cardFeatures>
    </b-tab>
  </div>
</template>

<script>
/**
 * Barra lateral derecha del mathpad.
 * <pre>
 * - Incluye tab para las caractisitcas de la ficha seleccionada.
 * </pre>
 *
 * @module interface-components-mathpad-right-bar
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import cardFeatures from "./mathpad/cardFeatures";

/**
 *
 */
export default {
  name: "rightBar",
  components: { cardFeatures }
};
</script>

<style>
.rightBar {
  float: left;
  width: 100%;
  height: 100%;
  background: var(--background-color-4) !important;
  overflow: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}
</style>
