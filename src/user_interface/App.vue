<template>
  <div id="app" class="app">
    <!-- Barra de título -->
    <titleBar></titleBar>
    <div class="app-content">
      <router-view></router-view>
    </div>
    <notifications></notifications>
  </div>
</template>

<script>
/**
 * Componente principal de la aplicación.
 * <pre>
 * - Marco vacio que encapsula toda la aplicación.
 * - Ocupa el 100% del ancho y el alto de la pantalla.
 * - Oculta cualquier elemento que se salga de sus limites sin posibilidad de scroll.
 * - Contiene el Mathpad.
 * </pre>
 *
 * @module interface-app
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import notifications from "./components/notifications";
import confirmation from "./components/confirmation";
import firebase from "firebase/app";
import "firebase/auth";

// Modulos creados
import mathpad from "./views/mathpad.vue";
import titleBar from "./components/titleBar.vue";

/**
 *
 */
export default {
  name: "app",
  components: {
    mathpad,
    titleBar,
    notifications,
    confirmation
  },

  // Acciones al montar el componente
  beforeMount: function() {
    // Detectar estado de la autenticación del usuario
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Registar que el usuario está logeado
        this.$store.commit("setUserIsLogged", {
          logged: true
        });

        // Registrar datos del usuario
        this.$store.commit("setUserData", {
          nickname: user.displayName,
          email: user.email
        });
      } else {
        // Registar que el usuario no está logeado
        this.$store.commit("setUserIsLogged", {
          logged: false
        });

        // Borrar datos del usuario
        this.$store.commit("setUserData", {
          nickname: undefined,
          email: undefined
        });
      }
    });
  },

  mounted: function() {
    // Verificar redimensionamiento de pantalla
    if (window.innerWidth > 768) {
      this.$store.commit("checkMovil", {
        value: false
      });
    } else {
      this.$store.commit("checkMovil", {
        value: true
      });
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.$store.commit("checkMovil", {
          value: false
        });
      } else {
        this.$store.commit("checkMovil", {
          value: true
        });
      }
    });
  }
};
</script>

<style>
/* Variables de estilos */
:root {
  /* Paleta de azules 1 */
  --palette-blue1-1: #032539;
  --palette-blue1-2: #042c44;
  --palette-blue1-3: #04334e;
  --palette-blue1-4: #053a59;
  --palette-blue1-5: #054164;
  --palette-blue1-6: #06486e;
  --palette-blue1-7: #064f79;
  --palette-blue1-8: #075684;
  --palette-blue1-9: #085c8f;

  /* Paleta de azules 2 */
  --palette-blue2-1: #02174d;
  --palette-blue2-2: #032479;
  --palette-blue2-3: #0231a8;
  --palette-blue2-4: #043cca;
  --palette-blue2-5: #0646e8;
  --palette-blue2-6: #054cff;
  --palette-blue2-7: #326cff;
  --palette-blue2-8: #6a94ff;
  --palette-blue2-9: #98a6c9;
  --palette-blue2-10: #eff0f3;

  /* Paleta de naranjas */
  --palette-orange-1: #ff1f0d;
  --palette-orange-2: #e83c0c;
  --palette-orange-3: #c55e0c;
  --palette-orange-4: #f07513;
  --palette-orange-5: #f39244;
  --palette-orange-6: #ffa70d;
  --palette-orange-7: #ffa70d;

  /* Paleta de grices */
  --palette-gray-1: #000000;
  --palette-gray-2: #c6c6c6;
  --palette-gray-3: #cccccc;
  --palette-gray-4: #d2d2d2;
  --palette-gray-5: #d9d9d9;
  --palette-gray-6: #dfdfdf;
  --palette-gray-7: #e6e6e6;
  --palette-gray-8: #ececec;
  --palette-gray-9: #f9f9f9;
  --palette-gray-10: #f9f9f9;
  --palette-gray-11: #ffffff;

  /* Otros */
  --palette-other-1: #05ff3c;

  /* Colores de fondo */
  --background-color-1: var(--palette-blue2-1);
  --background-color-2: var(--palette-blue2-2);
  --background-color-3: var(--palette-blue2-9);
  --background-color-4: var(--palette-gray-9);
  --background-color-5: var(--palette-gray-11);
  --background-color-6: var(--palette-gray-5);
  --background-color-7: var(--palette-orange-3);
  --background-color-8: var(--palette-orange-4);
  --background-color-9: var(--palette-orange-5);
  --background-color-10: var(--palette-blue2-10);
  --background-color-11: var(--palette-gray-2);

  /* Colores de borde */
  --border-color-1: var(--palette-blue2-1);
  --border-color-2: var(--palette-blue2-2);
  --border-color-3: var(--palette-blue2-9);
  --border-color-4: var(--palette-gray-9);
  --border-color-5: var(--palette-orange-4);
  --border-color-6: var(--palette-gray-6);

  /* Colores de texto */
  --text-color-1: var(--palette-blue2-1);
  --text-color-2: var(--palette-blue2-2);
  --text-color-3: var(--palette-blue2-9);
  --text-color-4: var(--palette-orange-4);
  --text-color-5: var(--palette-gray-9);
  --text-color-6: var(--palette-gray-1);
  --text-color-7: var(--palette-gray-2);
}

/* Fuentes */
.font-title {
  font-family: "Signika Negative", sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
}
.font-subtitle {
  font-family: "Signika Negative", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
}
.font-featured {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}
.font-normal-1 {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
}
.font-normal-2 {
  font-family: "Titillium Web", sans-serif;
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
}
.font-normal-3 {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
}
.font-help-1 {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
}
.font-help-2 {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
}
.font-small-1 {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
}
.font-small-2 {
  font-family: "Titillium Web", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 15px;
}

/* Campos de texto */
.input-text-1 {
  color: var(--text-color-6) !important;
  background-color: var(--background-color-10) !important;
  border: 2px solid var(--border-color-3);
  border-radius: 5px;
}
.input-text-1:focus {
  background-color: var(--background-color-4) !important;
  border: 2px solid var(--border-color-5);
  box-shadow: none;
}
.input-text-1::placeholder {
  color: var(--text-color-7) !important;
  font-style: italic;
}

.input-text-2 {
  color: var(--text-color-6) !important;
  background-color: var(--background-color-10) !important;
  border-bottom: 2px solid var(--border-color-1) !important;
}
.input-text-2:focus {
  background-color: var(--background-color-4) !important;
  border: 2px solid var(--border-color-5) !important;
  box-shadow: none;
}
.input-text-2::placeholder {
  color: var(--text-color-7) !important;
  font-style: italic;
}

/* Areas de texto */
.input-area-1 {
  color: var(--text-color-6) !important;
  background-color: var(--background-color-10) !important;
  border: 2px solid var(--border-color-3);
  border-radius: 5px;
}
.input-area-1:focus {
  background-color: var(--background-color-4) !important;
  border: 2px solid var(--border-color-5);
  box-shadow: none;
}
.input-area-1::placeholder {
  color: var(--text-color-7) !important;
  font-style: italic;
}

/* Botones */
.button-1 {
  background: var(--background-color-8);
  border: 0px;
  border-radius: 10px;
  box-shadow: none !important;
  height: 32px;
}
.button-1:focus {
  background: var(--background-color-8);
}
.button-1:active {
  background: var(--background-color-7) !important;
}
.button-1:visited {
  background: var(--background-color-8) !important;
}
.button-1:disabled {
  background: var(--background-color-8) !important;
}
.button-1:hover {
  background: var(--background-color-9);
}

.button-2 {
  color: var(--text-color-2);
  border: 2px solid var(--border-color-3) !important;
  background-color: var(--background-color-10);
  border-radius: 10px;
  box-shadow: none !important;
  padding: 0px !important;
  height: 32px;
}
.button-2:focus {
  background: var(--background-color-10);
}
.button-2:active {
  background: var(--background-color-11) !important;
}
.button-2:visited {
  background: var(--background-color-10) !important;
}
.button-2:disabled {
  background: var(--background-color-10) !important;
}
.button-2:hover {
  background: var(--background-color-4);
}

/* Estilos mas generales */
html {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
body {
  width: 100%;
  height: 100%;
}
.app {
  width: 100%;
  height: 100%;
  background: var(--background-color-3) !important;
}
.app-content {
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
}
div {
  min-width: 0px;
  min-height: 0px;
}

/* Escroll */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

@media only screen and (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

::-webkit-scrollbar-track {
  background: var(--background-color-4) !important;
}
::-webkit-scrollbar-thumb {
  background: var(--background-color-6) !important;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--background-color-8) !important;
}
</style>
