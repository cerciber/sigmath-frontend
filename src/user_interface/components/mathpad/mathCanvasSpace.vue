<template>
  <!-- Espacio en donde se encuentra el lienzo -->
  <div id="mathCanvasSpace" class="mathCanvasSpace">
    <b-input
      ref="equationInput"
      class="equation-input katex input-text-2"
      spellcheck="false"
      v-model="inputText"
      @keydown.native="addCardInputEnter"
      :readonly="disable"
      autocomplete="off"
      placeholder="Ingrese una expresión matemática"
    ></b-input>
    <!-- Cargando -->
    <div v-if="loading" class="command-loading-container">
      <img class="command-loading" :src="ilustations.loading" />
    </div>
    <b-button
      class="button-1 font-normal-3 math-canvas-space-button"
      @click="setParamCard"
      ><Solve></Solve>
      <div class="font-normal-3 math-canvas-space-button-text">
        &nbsp;Crear ficha
      </div></b-button
    >
    <!-- Lienzo -->
    <div class="canvas-container">
      <mathCanvas
        ref="mathCanvas"
        v-on:canvasDraggerBlocker="canvasDraggerBlocker"
        v-bind:panzoom="panzoom"
      ></mathCanvas>
    </div>
    <!-- Panel de resultados -->
    <cardResults class="cardResults"></cardResults>
  </div>
</template>

<script>
/**
 * Espacio en donde se ubica el lienzo matemático.
 * <pre>
 * - Contiene el lienzo matemático.
 * - Contiene oculto el panel de resultados.
 * - Tiene propiedades de acercamiento.
 * - Es arrastrable.
 * </pre>
 *
 * @module interface-components-mathpad-canvas-space
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import mathCanvas from "./mathCanvas";
import cardResults from "./cardResults";
import canvasController from "../../../controllers/canvasController";
import commandLineController from "../../../controllers/commandLineController";
import fastCardAgent from "../../../service_agents/fastCardAgent";
import Solve from "vue-material-design-icons/ArrowRightCircleOutline";

/**
 * @vue-data {json} panZoomOptions - Opciones de la libreria de aceramiento.
 * @vue-data {number} [panZoomOptions.minZoom=0.5] - Escala minima del zoom.
 * @vue-data {number} [panZoomOptions.maxZoom=5000] - Escala maxima del zoom.
 * @vue-data {number} [panZoomOptions.zoomDoubleClickSpeed=1] - Factor de la variación de acercamiento del zoom.
 * @vue-data {boolean} [panZoomOptions.smoothScroll=false] - Cancelar la inercia del movimiento.
 * @vue-data {function} panZoomOptions.beforeWheel - Acciones antes de realizar zoom con la rueda del mouse.
 * @vue-data {boolean} draggable - Permitir o bloquear el arrastrado del espacio.
 * @vue-data {number} scale - Factor de acercamiento del zoom.
 */
export default {
  name: "mathCanvasSpace",
  components: {
    mathCanvas,
    cardResults,
    Solve
  },
  data() {
    const self = this;
    return {
      canvasController: canvasController,
      panzoom: undefined,
      panZoomOptions: {
        minZoom: 0.5,
        maxZoom: 5000,
        zoomDoubleClickSpeed: 1,
        smoothScroll: false,
        filterKey: function() {
          // Ocultar controles del lienzo y las fichas
          self.$store.commit("canvasControllers", { value: false });
          self.$store.commit("setControllersTo", { cardOrCanvas: null });
          return false;
        }
      },
      draggable: true,
      scale: 1,
      inputText: "",
      disable: false,
      loading: false,
      ilustations: {
        loading: `./../../../../public/svg/loading.gif`
      }
    };
  },
  methods: {
    /**
     * Permitir o bloquear arrsatrado del lienzo.
     *
     *  @param {boolean} state - Estado. (true permite arrsatrar el espacio, false bloquea el espacio.)
     */
    canvasDraggerBlocker(state) {
      this.draggable = state;
    },

    /**
     * Acciones al iniciar el espacio del lienzo.
     *
     * @param {object} instance - Instancia del componente de acercamiento.
     */
    onInit(instance) {
      // Obtener contexto
      var self = this;

      // Definir variable para consevar las utimas coordenadas del lienzo
      var lastX = undefined;
      var lastY = undefined;

      // Al iniciar a arrastrar el espacio.
      instance.on("panstart", function(e) {
        // Ocultar los controles del lienzo y las fichas.
        self.$store.commit("setControllersTo", { card: null });
        self.$store.commit("canvasControllers", { value: false });

        // Si el espacio está bloqueado
        if (!self.draggable) {
          // Obtener posición de la tranformación actual
          lastX = e.getTransform().x;
          lastY = e.getTransform().y;
        }
      });

      // Al continuar arrastrando el espacio.
      instance.on("pan", function(e) {
        // Si el espacio está bloqueado
        if (!self.draggable) {
          // Asignar ultima tranformación para que el espacio no se mueva
          e.getTransform().x = lastX;
          e.getTransform().y = lastY;
        }
      });

      // Al realizar zoom
      instance.on("zoom", function(e) {
        // Si el zoom no se hizo por doble click
        if (!self.$store.state.mathpad.zoomByDoubleClick) {
          // Ocultar los controles del lienzo y las fichas.
          self.$store.commit("setControllersTo", { card: null });
          self.$store.commit("canvasControllers", { value: false });
        }

        // Cambiar escala
        self.scale = e.getTransform().scale;
        self.$store.commit("setScale", { scale: self.scale });
      });

      // Al termonar de hacer zoom
      instance.on("zoomend", function(e) {
        // Asignar que el zoom ya no se hará por doble click
        self.$store.commit("zoomByDoubleClick", { value: false });
      });
    },
    /**
     * Añadir ficha al lienzo.
     */
    setParamCard() {
      // Verificar si hay algun campo vacio
      if (this.inputText.trim() === "") {
        this.inputText = "";
        return;
      }

      this.loading = true;

      var param = this.$store.state.mathpad.writingParam;
      var writingCard = this.$store.state.mathpad.writingCard;
      this.$refs.equationInput.$el.focus();
      this.disable = true;
      fastCardAgent(
        commandLineController.convertToSympy(this.inputText),
        (state, data) => {
          // Si se obtuvieron resultados
          if (state === 200) {
            var card = canvasController.addCard(data);
            // Si la ficha debe ser asignada en un parametro
            if (param) {
              canvasController.removeCard(card);
              param.content = card;

              this.$store.commit("setNotification", {
                text: "El parametro se convirtió correctamente.",
                type: "info",
                duration: 5
              });
              writingCard.update = true;
            } else {
              card.solvedOf = this.$store.state.mathpad.selectedCard;
              this.$store.commit("setMathpadSelectedCard", {
                selectedCard: card
              });
              this.$store.commit("setNotification", {
                text: "La ficha se añadió al lienzo",
                type: "info",
                duration: 5
              });
            }

            if (param === this.$store.state.mathpad.writingParam) {
              this.$store.commit("setWritingParam", {
                cardRoot: null,
                param: null
              });
              this.inputText = "";
            } else {
              if (param && typeof param.content === "string") {
                this.inputText = param.content;
              }
            }
          }

          // Si hubo algun otro error
          else {
            this.$store.commit("setNotification", {
              text: data,
              type: "danger",
              duration: 5
            });
          }

          // Borrar
          this.disable = false;
          this.loading = false;
        }
      );
    },
    addCardInputEnter(event) {
      if (event.which === 13) {
        this.setParamCard();
      }
    }
  },
  computed: {
    /**
     * Validar si se está seleccionando la ficha actual
     */
    focusEcuationInput() {
      return this.$store.state.mathpad.focusEcuationInput;
    },

    /**
     * Validar si se se asignó un nuevo texto inicial
     */
    newEcuationInputText() {
      return this.$store.state.mathpad.newEcuationInputText;
    }
  },
  watch: {
    /**
     * Escuchar si se deben enfocar el input de las ecuaciones.
     */
    focusEcuationInput(newCount, oldCount) {
      if (newCount) {
        this.$refs.equationInput.$el.focus();
        this.$store.state.mathpad.focusEcuationInput = false;
      }
    },

    /**
     * Escuchar cuando hay cambios en el input de ecuaciones
     */
    inputText(newCount, oldCount) {
      if (this.$store.state.mathpad.writingParam) {
        this.$store.state.mathpad.writingParam.content = newCount;
        this.$store.commit("setNewEcuationInputText", {
          text: newCount
        });
      }
    },

    /**
     * Escuchar cuando hay un nuevo texto de ecuación
     */
    newEcuationInputText(newCount, oldCount) {
      this.inputText = newCount;
    }
  },
  mounted: function() {
    this.panzoom = this.$refs.panzoom;
    this.$refs.equationInput.$el.focus();
  }
};
</script>

<style>
.mathCanvasSpace {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.canvas-container {
  height: 100%;
  width: 100%;
}
.vue-pan-zoom-scene {
  height: 100%;
  width: 100%;
}
.vue-pan-zoom-item {
  height: 100%;
  width: 100%;
}
:focus {
  outline-width: 0px;
}
.cardResults {
  position: relative;
  top: calc(-100% - 43.5px);
  height: 100%;
  width: 100%;
}
.equation-input {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 44px;
  border-radius: 0px;
  text-align: left;
  padding-left: 10px !important;
}
.math-canvas-space-button {
  margin-left: -120px;
  margin-top: 6px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-top: 4px !important;
}

.command-loading {
  position: absolute;
  width: 40px;
  z-index: 2;
  left: calc(100% - 158px);
  top: 2px;
  pointer-events: none;
}
.command-loading-container {
  z-index: 2;
  position: relative;
  pointer-events: none;
}

@media only screen and (max-width: 940px) {
  .math-canvas-space-button-text {
    display: none;
  }

  .math-canvas-space-button {
    background-color: transparent !important;
    color: var(--background-color-8);
    margin-left: -48px;
  }

  .command-loading {
    left: calc(100% - 44px);
  }
}
</style>
