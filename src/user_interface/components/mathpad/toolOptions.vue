<template>
  <div>
    <!-- Barra de herramientas -->
    <b-navbar-nav>
      <b-nav-item class="navbar-item">
        <!-- NO BORRAR!!! />-->
        <!-- <FolderOutline class="navbar-icon" />-->
        <div v-on:click="programCard"><Code class="navbar-icon" /></div>
        <div class="navbar-text" v-on:click="programCard">
          Programar ficha
        </div>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <!-- NO BORRAR!!! />-->
        <!-- <FolderOutline class="navbar-icon" />-->
        <div v-on:click="clearCanvasConfirmation">
          <LayersRemove class="navbar-icon" />
        </div>
        <div class="navbar-text" v-on:click="clearCanvasConfirmation">
          Limpiar hoja
        </div>
      </b-nav-item>
      <b-nav-item v-if="grid" class="navbar-item">
        <!-- NO BORRAR!!! />-->
        <!-- <FolderOutline class="navbar-icon" />-->
        <div v-on:click="hideGrid">
          <GridOff class="navbar-icon" />
        </div>
        <div class="navbar-text" v-on:click="hideGrid">
          Ocultar cuadrícula
        </div>
      </b-nav-item>
      <b-nav-item v-else class="navbar-item">
        <!-- NO BORRAR!!! />-->
        <!-- <FolderOutline class="navbar-icon" />-->
        <div v-on:click="showGrid">
          <Grid class="navbar-icon" />
        </div>
        <div class="navbar-text" v-on:click="showGrid">
          Mostrar cuadrícula
        </div>
      </b-nav-item>
      <!-- NO BORRAR!!! />-->
      <!-- 
      <b-nav-item class="navbar-item item-space">
        <ContentSave class="navbar-icon" v-on:click="glNotification" />
        <div class="navbar-text">Guardar Lienzo</div>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <PlusBox class="navbar-icon" />
        <div class="navbar-text">
          <b-nav-item-dropdown
            text="Nueva Ficha"
            class="navbar-dropdown-text"
            split
          >
            <div class="navbar-dropdown-items">
              <div class="navbar-dropdown-items-content">
                <b-dropdown-item>
                  <div class="navbar-dropdown-item">
                    <Flash class="navbar-icon" :size="18" />
                    <div
                      class="navbar-dropdown-item-text"
                      v-b-modal.fastCardModal
                    >
                      Ficha rápida
                    </div>
                  </div>
                </b-dropdown-item>
                <b-dropdown-item>
                  <div class="navbar-dropdown-item">
                    <Code class="navbar-icon" :size="18" />
                    <div
                      class="navbar-dropdown-item-text"
                      v-on:click="programCard"
                    >
                      Ficha programada
                    </div>
                  </div>
                </b-dropdown-item>
                <div class="navbar-dropdown-line" />
                <b-dropdown-item>
                  <div class="navbar-dropdown-item">
                    <Biblio class="navbar-icon" :size="18" />
                    <div class="navbar-dropdown-item-text">Biblio fichas</div>
                  </div>
                </b-dropdown-item>
              </div>
            </div>
          </b-nav-item-dropdown>
        </div>
      </b-nav-item>
      <b-nav-item class="navbar-item item-space">
        <OpenInApp class="navbar-icon" />
        <div class="navbar-text">Abrir Ficha</div>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <Undo class="navbar-icon" />
        <div class="navbar-text">Deshacer</div>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <Redo class="navbar-icon" />
        <div class="navbar-text">Rehacer</div>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <Zoom class="navbar-icon" />
        <div class="navbar-text">Zoom</div>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <Expand class="navbar-icon" />
        <div class="navbar-text">Lienzo</div>
      </b-nav-item>
      -->
    </b-navbar-nav>
    <FastCard></FastCard>
    <confirmation
      ref="confirmationCleanCanvas"
      v-bind:showConfirmation="showConfirmation"
      v-bind:title="'Limpiar lienzo'"
      v-bind:content="
        '¿Estás seguro de que deseas limpiar el lienzo?. Todas las fichas desaparecerán.'
      "
      v-bind:accept="'Si'"
      v-bind:cancel="'No'"
      v-on:onAccept="clearCanvas"
    ></confirmation>
  </div>
</template>

<script>
/**
 * Barra de herramientas del MathPad.
 *
 * @module interface-components-mathpad-tool-options
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Menu from "vue-material-design-icons/Menu.vue";
import FilePlus from "vue-material-design-icons/FilePlus.vue";
import FolderOutline from "vue-material-design-icons/FolderOutline.vue";
import ContentSave from "vue-material-design-icons/ContentSave.vue";
import PlusBox from "vue-material-design-icons/PlusBox.vue";
import OpenInApp from "vue-material-design-icons/OpenInApp.vue";
import Undo from "vue-material-design-icons/Undo.vue";
import Redo from "vue-material-design-icons/Redo.vue";
import Zoom from "vue-material-design-icons/MagnifyPlusOutline.vue";
import Expand from "vue-material-design-icons/ArrowExpandAll.vue";
import Flash from "vue-material-design-icons/Flash.vue";
import Code from "vue-material-design-icons/CodeTags.vue";
import Biblio from "vue-material-design-icons/Store.vue";
import LayersRemove from "vue-material-design-icons/LayersRemove.vue";
import GridOff from "vue-material-design-icons/GridOff.vue";
import Grid from "vue-material-design-icons/Grid.vue";

// Modulos creados
import FastCard from "./fastCard";
import canvasController from "../../../controllers/canvasController";
import confirmation from "../confirmation";

/**
 *
 */
export default {
  name: "toolOptions",
  data() {
    return {
      showConfirmation: { show: false }
    };
  },
  components: {
    Menu,
    FilePlus,
    FolderOutline,
    ContentSave,
    PlusBox,
    OpenInApp,
    Undo,
    Redo,
    Zoom,
    Expand,
    Flash,
    Code,
    Biblio,
    FastCard,
    LayersRemove,
    Grid,
    GridOff,
    confirmation
  },
  methods: {
    /**
     * Mostrar panel de programación de fichas
     */
    programCard() {
      // Mostrar panel de programación
      this.$store.commit("setNewProgrammigCard");
      this.$store.commit("setMathpadProgramCard");
      // Notificar error
      this.$store.commit("setNotification", {
        text:
          "Hemos puesto una integral indefinida como base, puedes editar los códigos como quieras.",
        type: "info",
        duration: 5
      });
    },

    /**
     * Limpiar el lienzo
     */
    clearCanvasConfirmation() {
      this.showConfirmation.show = true;
    },

    /**
     * Limpiar el lienzo
     */
    clearCanvas() {
      // Limpiar lienzo
      canvasController.clean();
      // Desasignar ficha que se estaba arrastrando
      this.$store.commit("setMathpadSelectedCard", {
        selectedCard: null
      });
      this.showConfirmation.show = false;
    },

    hideGrid() {
      this.$store.commit("setGridState", {
        value: false
      });
    },

    showGrid() {
      this.$store.commit("setGridState", {
        value: true
      });
    }
  },
  computed: {
    grid() {
      return this.$store.state.mathpad.grid;
    }
  }
};
</script>

<style>
.navbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: wrap;
}
.navbar-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
}

.navbar-text {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff !important;
}

@media only screen and (max-width: 768px) {
  .navbar-text {
    display: none;
  }
}

.navbar-dropdown-text {
  position: relative;
  left: -4px;
}
.dropdown-toggle {
  color: #ffffff !important;
}
.dropdown-toggle::after {
  position: absolute;
  top: -9px;
  margin-left: -2px;
  content: "";
  border-top: 5px solid;
  border-right: 5px solid transparent;
  border-bottom: 0;
  border-left: 5px solid transparent;
  color: rgba(255, 255, 255, 0.5);
}
.dropdown-menu {
  box-shadow: 0px 5px 15px 5px rgba(0, 0, 0, 0.2);
  border-radius: 0px;
  left: calc(-50%);
  border: none;
  width: 142px;
  max-width: 142px;
  min-width: 142px;
}
.navbar-dropdown-items {
  margin-top: -14.5px;
  margin-bottom: -8px;
  background: linear-gradient(180deg, #032479 0%, #02174c 100%);
  clip-path: polygon(
    -1px 6px,
    -1px 100%,
    calc(100% + 1px) 100%,
    calc(100% + 1px) 6px,
    calc(50% + 6.5px) 6px,
    50% 0px,
    calc(50% - 6.5px) 6px
  );
  border: none;
}
.navbar-dropdown-items-content {
  padding-top: 20px;
  padding-bottom: 4px;
}
.navbar-dropdown-item {
  display: flex;
  align-items: center;
  margin-left: -15px;
}
.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}
.navbar-dropdown-item-text {
  margin-left: 7px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
}
.navbar-dropdown-line {
  width: 100%;
  height: 1px;
  margin: 4px;
  background-color: rgba(255, 255, 255, 0.15);
}
.item-space {
  margin-right: 50px;
}
</style>
