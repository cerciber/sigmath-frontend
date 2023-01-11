<template>
  <!-- Barra de título -->
  <div class="container-fluid titleBar">
    <!-- Logo y Nombre de la aplicación -->
    <router-link to="/mathpad">
      <div class="font-subtitle title">
        <!-- Logo -->
        <div class="title-bar-logo-content">
          <div class="title-bar-logo">
            <img :src="ilustations.logo" />
          </div>
        </div>
        <!--Nombre de la aplicación -->
        <span>SigMath</span>
      </div>
    </router-link>
  </div>
</template>

<script>
/**
 * Barra del título mathpad.
 * <pre>
 * - Incluye el logo en miniatura.
 * - Incluye el nombre de la aplicación.
 * - Incluye el nombre del archivo actual (NO SE HA IMPLEMENTADO).
 * </pre>
 *
 * @module interface-components-mathpad-title-bar
 * @author Labeleon <labeleon@gmail.com>
 */

/**
 *
 */
export default {
  name: "titleBar",
  data() {
    return {
      ilustations: {
        logo: `./../../../public/svg/logo_sigmath-03.svg`
      }
    };
  }
};
</script>

<style>
.titleBar {
  background: var(--background-color-1);
  height: 40px;
}
.title {
  color: var(--text-color-4);
  max-height: 100%;
  height: 100%;
  width: 250px;
  display: flex;
  padding-left: 0px;
  padding-top: 10px;
  float: left;
}
.title-bar-logo-content {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  margin-top: -1.5px;
}
.title-bar-logo {
  width: 20px;
  height: 20px;
}
</style>
