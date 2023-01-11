<template>
  <div class="menu-options">
    <b-nav-item>
      <Menu class="menu-icon" :size="30" />
    </b-nav-item>
  </div>
</template>

<script>
/**
 * Menu de opciones del MathPad. (NO SE HA IMPLEMENTADO.)
 *
 * @module interface-components-mathpad-menu-options
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Menu from "vue-material-design-icons/Menu.vue";

/**
 *
 */
export default {
  name: "menuOptions",
  components: { Menu },
};
</script>

<style>
.menu-options {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
.menu-icon {
  color: #f07513;
}
</style>
