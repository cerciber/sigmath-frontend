<template>
  <!-- Mathpad -->
  <div ref="mathpad" id="mathpad" class="mathpad">
    <!-- Barra de herramientas -->
    <toolBar :parent="'mathpad'"></toolBar>
    <div v-if="!$store.state.movil" class="mathpad-layout">
      <SplitGrid
        class="mathpad-horizontal"
        :strictMode="false"
        v-on:drag-start="onDragStart"
        key="mathpad-web"
      >
        <!-- Barra lateral izquierda -->
        <SplitGridArea
          class="mathpad-lateral1"
          size-unit="px"
          :size-value="250"
        >
          <b-tabs
            content-class="mt-3"
            fill
            no-nav-style
            active-nav-item-class="left-bar-active-tab"
            class="leftBar"
          >
            <leftBar></leftBar>
          </b-tabs>
        </SplitGridArea>
        <SplitGridGutter />
        <SplitGridArea>
          <SplitGrid direction="row" class="mathpad-center" :strictMode="false">
            <SplitGrid
              :strictMode="false"
              :size-unit="size.unit"
              :size-value="size.value"
            >
              <!-- Espacio del lienzo -->
              <SplitGridArea class="mathpad-center1" :size-value="250">
                <mathCanvasSpace></mathCanvasSpace>
              </SplitGridArea>
            </SplitGrid>
            <SplitGridGutter />
            <SplitGrid :strictMode="false">
              <!-- Barra inferior -->
              <SplitGridArea class="mathpad-center2">
                <bottomBar></bottomBar>
              </SplitGridArea>
            </SplitGrid>
          </SplitGrid>
        </SplitGridArea>
        <SplitGridGutter />
        <!-- Barra lateral derecha -->
        <SplitGridArea
          class="mathpad-lateral2"
          size-unit="px"
          :size-value="250"
        >
          <b-tabs
            content-class="mt-3"
            fill
            active
            no-nav-style
            active-nav-item-class="left-bar-active-tab"
            class="rightBar"
          >
            <rightBar></rightBar>
          </b-tabs>
        </SplitGridArea>
      </SplitGrid>
    </div>
    <div v-else class="mathpad-layout">
      <SplitGrid
        class="mathpad-horizontal"
        :strictMode="false"
        v-on:drag-start="onDragStart"
        key="mathpad-movil"
      >
        <SplitGridArea>
          <SplitGrid direction="row" class="mathpad-center" :strictMode="false">
            <SplitGrid
              direction="row"
              class="mathpad-center"
              :strictMode="false"
              :gutterSize="25"
            >
              <!-- Espacio del lienzo -->
              <SplitGridArea
                class="mathpad-center1"
                :size-unit="'%'"
                :size-value="50"
              >
                <mathCanvasSpace></mathCanvasSpace>
              </SplitGridArea>
              <SplitGridGutter />
              <!-- Barra inferior -->
              <SplitGridArea class="mathpad-center2">
                <b-tabs
                  content-class="mt-3"
                  fill
                  no-nav-style
                  active-nav-item-class="left-bar-active-tab"
                  class="leftBar"
                >
                  <leftBar></leftBar>
                  <rightBar></rightBar>
                  <b-tab title="Programador" :title-link-class="'left-bar-tab'">
                    <div class="tab-item-wrapper">
                      <v-layout fill-height>
                        <bottomBar></bottomBar>
                      </v-layout>
                    </div>
                  </b-tab>
                </b-tabs>
              </SplitGridArea>
            </SplitGrid>
          </SplitGrid>
        </SplitGridArea>
      </SplitGrid>
    </div>
  </div>
</template>

<script>
/**
 * Esquema básico del MathPad
 * <pre>
 * - Incluye la barra de título.
 * - Incluye la barra de herramientas.
 * - Incluye la barra lateral izquierda.
 * - Incluye el espacio del lienzo.
 * - Incluye la barra lateral derecha.
 * </pre>
 *
 * @module  interface-view-mathpad
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import { SplitGrid, SplitGridArea, SplitGridGutter } from "vue-split-grid";

// Modulos creados
import toolBar from "../components/toolBar";
import leftBar from "../components/leftBar";
import rightBar from "../components/rightBar";
import bottomBar from "../components/bottomBar";
import mathCanvasSpace from "../components/mathpad/mathCanvasSpace";
/**
 * @vue-data {boolean} mounted - Valida si el compoente ya se montó.
 *
 * @vue-computed {tipo} show - Valida si se está programando una ficha.
 * @vue-computed {tipo} size - Muestra la barra inferior si se está programando una ficha.
 */
export default {
  name: "mathpad",
  data() {
    return {
      mounted: false
    };
  },
  components: {
    SplitGrid,
    SplitGridArea,
    SplitGridGutter,
    toolBar,
    leftBar,
    rightBar,
    bottomBar,
    mathCanvasSpace
  },
  methods: {
    /**
     * Acciones al iniciar el arrastrado de la barra de dimensionamiento.
     * <pre>
     * - Ocultar controles del lienzo y las fichas
     * </pre>
     */
    onDragStart() {
      // Ocultar controles del lienzo y las fichas
      this.$store.commit("canvasControllers", { value: false });
      this.$store.commit("setControllersTo", { cardOrCanvas: null });
    }
  },
  computed: {
    /**
     * Validar si se está programando una ficha.
     */
    show() {
      return this.$store.state.mathpad.programCard;
    },

    /**
     * Mostrar la barra inferior si se está programando una ficha.
     */
    size() {
      return this.show
        ? {
            value: this.mounted ? this.$el.clientHeight * 0.45 : 0,
            unit: "px"
          }
        : {
            value: this.mounted ? this.$el.clientHeight - 70 : 0,
            unit: "px"
          };
    }
  },

  // Acciones al montar el componente
  mounted: function() {
    this.mounted = true;
  }
};
</script>

<style>
.mathpad {
  width: 100%;
  height: 100%;
}
.mathpad-layout {
  width: 100%;
  height: 100%;
}
.mathpad-horizontal {
  width: 100%;
  height: calc(100% - 70px);
}
.mathpad-lateral1 {
  width: 100%;
  height: 100%;
}
.mathpad-lateral2 {
  width: 100%;
  height: 100%;
}
.mathpad-center {
  width: 100%;
  height: 100%;
}
.mathpad-center1 {
  width: 100%;
  height: 100%;
}
.mathpad-center2 {
  width: 100%;
  height: 100%;
}
.vsg_split-grid {
  overflow: hidden;
}
.vsg_gutter[data-v-a6ac4e44] {
  background-color: #02174c;
}
.nav-link {
  white-space: nowrap;
}
.nav {
  overflow: auto;
  flex-wrap: nowrap;
}
.tab-item-wrapper {
  height: 600px;
}
</style>
