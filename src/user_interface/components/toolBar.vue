<template>
  <!-- Barra de herramientas -->
  <b-navbar type="dark" variant="info" class="toolBar">
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <!-- Menú de opciones -->
        <!-- NO BORRAR!!! />-->
        <!-- <menuOptions></menuOptions> -->
        <div v-if="parent == 'mathpad'">
          <!-- Opciones de herramientas -->
          <toolOptions></toolOptions>
        </div>
        <div v-else-if="parent == 'userCards'">
          <!-- Opciones de las fichas del usuario -->
          <userCardOptions></userCardOptions>
        </div>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <!-- Opciones del usuario -->
        <userOptions></userOptions>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
/**
 * Barra de herramientas del mathpad.
 * <pre>
 * - Incluye el menú de opciones.
 * - Incluye las opciones de herramientas.
 * - Incluye las opciones del usuario.
 * </pre>
 *
 * @module interface-components-mathpad-tool-bar
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import menuOptions from "./mathpad/menuOptions";
import toolOptions from "./mathpad/toolOptions";
import userOptions from "./userOptions";
import userCardOptions from "./userCard/userCardOptions";

/**
 *
 */
export default {
  name: "toolBar",
  components: { menuOptions, toolOptions, userOptions, userCardOptions },
  props: {
    parent: String
  }
};
</script>

<style>
.toolBar {
  height: 70px;
  background: var(--background-color-2) !important;
  box-shadow: 0px 5px 5px 1px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 3;
}
</style>
