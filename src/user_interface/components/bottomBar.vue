<template>
  <!-- Barra inferior -->
  <div class="bottomBar">
    <cardProgramer></cardProgramer>
  </div>
</template>

<script>
/**
 * Barra lateral izquierda del mathpad.
 * <pre>
 * - Incluye tab para el panel de busqueda.
 * - Incluye tab para el arbol de fichas.
 * </pre>
 *
 * @module interface-components-mathpad-botton-bar
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import cardProgramer from "./mathpad/cardProgramer";

/**
 *
 */
export default {
  name: "bottomBar",
  components: { cardProgramer },
  methods: {}
};
</script>

<style>
.bottomBar {
  float: left;
  width: 100%;
  height: 100%;
  overflow: auto;
}
@media only screen and (max-width: 768px) {
  .bottomBar {
    float: left;
    width: 100%;
    height: 100%;
    overflow: auto;
    margin-top: -17px;
    margin-bottom: -100px !important;
  }
}
</style>
