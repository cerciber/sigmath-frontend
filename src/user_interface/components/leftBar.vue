<template>
  <!-- Barra lateral izquierda -->
  <div>
    <!-- Tab menu -->
    <b-tab title="Biblio Fichas" :title-link-class="'left-bar-tab'" active>
      <defaultCards></defaultCards>
    </b-tab>
    <!-- Barra de búsqueda -->
    <b-tab title="Búsqueda" :title-link-class="'left-bar-tab'">
      <cardSearcher></cardSearcher>
    </b-tab>
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
 * @module interface-components-mathpad-left-bar
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import cardTree from "./mathpad/cardTree";
import cardSearcher from "./mathpad/cardSearcher";
import defaultCards from "./mathpad/defaultCards";
/**
 *
 */
export default {
  name: "leftBar",
  components: { cardTree, cardSearcher, defaultCards }
};
</script>

<style>
.leftBar {
  float: left;
  width: 100%;
  height: 100%;
  background: var(--background-color-4) !important;
  overflow: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}
.left-bar-tab,
.left-bar-tab:hover {
  margin-top: 0px !important;
  padding-top: 15px;
  background: var(--background-color-2) !important;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: var(--text-color-3);
  margin-top: 5px;
}

@media only screen and (max-width: 768px) {
  .left-bar-tab,
  .left-bar-tab:hover {
    padding-top: 8px;
  }
}

.left-bar-active-tab,
.left-bar-active-tab:hover {
  color: var(--text-color-4);
  border-bottom: 1px solid #f07513;
}
</style>
