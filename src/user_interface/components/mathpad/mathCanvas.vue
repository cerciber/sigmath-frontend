<template>
  <!-- Componente que permite desplazar y transformar el lienzo -->
  <Moveable
    ref="moveable"
    class="moveableCanvas"
    id="moveableCanvas"
    v-bind="moveable"
    @resize="handleResize"
    @drag="handleDrag"
  >
    <!-- Lienzo matemático -->
    <div
      id="mathCanvas"
      :class="'mathCanvas ' + (grid ? 'mathCanvasGrid' : '')"
      v-on:dblclick="onDblClick"
      v-on:mousedown="onMouseDown"
      v-on:touchstart="onTouchStart"
    >
      <!-- Lista de fichas contenidas en el lienzo -->
      <div
        v-for="cardJson in canvasController.cards"
        :key="'card' + cardJson.id"
      >
        <!-- Ficha matemática -->
        <card
          v-bind:cardJson="cardJson"
          :ref="'card' + cardJson.id"
          :id="'card' + cardJson.id"
          v-on:canvasDraggerBlocker="canvasDraggerBlocker"
          v-on:setSelectedCardParam="setSelectedCardParam"
          v-on:getSelectedCardParam="getSelectedCardParam"
          v-on:simulateMouseDown="simulateMouseDown"
          v-on:simulateTouchDown="simulateTouchDown"
        ></card>
      </div>
    </div>
  </Moveable>
</template>

<script>
/**
 * Lienzo matemático.
 * <pre>
 * - Contiene una lista de fichas matemáticas en coordenas específicas.
 * - Es seleccionable.
 * - Es es redimensionable. (Sin coservar el ratio)
 * </pre>
 *
 * @module interface-components-mathpad-canvas
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import card from "./card.vue";
import canvasController from "../../../controllers/canvasController";

/**
 * @vue-data {module} canvasController - controlador del lienzo.
 * @vue-data {json} moveable - Propiedades de la libreria de movimiento y redimensionamiento.
 * @vue-data {boolean} [moveable.resizable=true] - Permitir redimensionalidad.
 * @vue-data {number} [moveable.zoom=0] - Tamaño de los controles.
 */
export default {
  name: "mathCanvas",
  props: ["panzoom"],
  components: {
    card
  },
  data() {
    return {
      canvasController: canvasController,
      moveable: {
        draggable: true,
        resizable: true,
        zoom: 0
      },
      doubleClick: {
        clicks: 0,
        delay: 400,
        timer: null
      }
    };
  },
  methods: {
    /**
     * Acciones al presionar doble click.
     * <pre>
     * - Omitir doble click si se estableció anteriormente.
     * - Mostrar controles de tranformación del lienzo.
     * </pre>
     */
    onDblClick() {
      // Mostrar controles de tranformación del lienzo.
      if (this.moveable.zoom !== 0) {
        this.hideUtils();
      } else {
        this.showUtils();
      }

      // Asignar que el zoom se hará por doble click
      this.$store.commit("zoomByDoubleClick", { value: true });
    },

    onMouseDown() {
      if (this.moveable.draggable) {
        this.$store.commit("setWritingParam", {
          cardRoot: null,
          param: null
        });
        this.$store.commit("setMathpadDraggedCard", {
          draggedCard: null
        });
        this.$store.commit("setMathpadSelectedCard", {
          selectedCard: null
        });
      }

      // Enviar señal del mouse al sensor de boble click
      //this.dblClickSensor();
    },

    onTouchStart() {
      this.onMouseDown();
      // Enviar señal del mouse al sensor de boble click
      this.dblClickSensor();
    },

    /**
     * Mostrar controles de tranformación del lienzo.
     */
    showUtils() {
      // Actualizar posición del rectangulo de los controles
      this.$refs.moveable.updateRect();

      // Mostrar controles
      this.$store.commit("canvasControllers", { value: true });
      this.$store.commit("setControllersTo", { cardOrCanvas: null });
    },

    /**
     * Ocultar controles de tranformación del lienzo.
     */
    hideUtils() {
      // Ocultar controles
      this.$store.commit("canvasControllers", { value: false });
      this.$store.commit("setControllersTo", { cardOrCanvas: null });
    },

    /**
     * Manejador de los cambios al redimensionar el lienzo.
     *
     * @param {json} params - Parametros de la función.
     * @param {object} params.target - Elemento HTML que contiene la ficha.
     * @param {number} params.width - Nuevo ancho del redimensionamiento.
     * @param {number} params.height - Nuevo alto del redimensionamiento.
     * @param {number[]} params.delta - Variación de las dimensiones del rectangulo (0: vetical, 1: horizontal).
     */
    handleResize({ target, width, height, delta }) {
      // asignar nuevas dimensiones
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },

    handleDrag({ target, transform }) {
      // Transformar coordenadas
      target.style.transform = transform;
    },

    /**
     * Bloquear o permitir arrastrado del espacio del lienzo.
     *
     * @param {boolean} state - Parametros de la función.
     */
    canvasDraggerBlocker(state) {
      //  Bloquear o permitir arrastrado del espacio del lienzo.
      this.moveable.draggable = state;
    },

    /**
     * Añadir ficha que se está arrastrando al paramtro de la ficha especificada en la posición especificada.
     *
     * @param {josn} cardContent - Ficha contenedora.
     * @param {integer} pos - Posición del parametro a asignar.
     */
    setSelectedCardParam(rootCard, cardContent, pos) {
      if (this.$store.state.mathpad.draggedCard !== cardContent) {
        var validator = canvasController.addParam(
          this.$store.state.mathpad.draggedCard,
          cardContent,
          pos
        );

        // Desasignar ficha que se estaba arrastrando
        this.$store.commit("setMathpadDraggedCard", {
          draggedCard: null
        });

        // Asignar ficha contenedora como ficha seleccionada
        if (validator) {
          this.$store.commit("setMathpadSelectedCard", {
            selectedCard: rootCard
          });
        }
      }
    },

    /**
     * Obtener ficha contenida en la posición especificada de la ficha especificada.
     *
     * @param {josn} cardContent - Ficha contenedora.
     * @param {integer} pos - Posición del parametro a desasignar.
     */
    getSelectedCardParam(cardContent, pos) {
      var card = canvasController.removeParam(cardContent, pos);
    },

    /**
     * Simular el presionar el mouse hacia abajo para la última ficha ingresada.
     *
     */
    simulateMouseDown() {
      // Obtener ultima ficha ingresada
      var element = document.getElementById(
        "card" + canvasController.cards[canvasController.cards.length - 1].id
      );

      // Crear, iniciar y lanzar evento del mousedown
      var event = document.createEvent("MouseEvents");
      event.initEvent("mousedown", true, true);
      element.dispatchEvent(event);
    },

    /**
     * Simular el presionar el mouse hacia abajo para la última ficha ingresada.
     *
     */
    simulateTouchDown(cardJson) {
      // Obtener ultima ficha ingresada
      var element = document.getElementById("card" + cardJson.id);

      const touchObj = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: 0,
        clientY: 0,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5
      });

      const touchEvent = new TouchEvent("touchstart", {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        shiftKey: true
      });

      element.dispatchEvent(touchEvent);
    },

    /**
     * Asignar ficha especificada en las caracteristicas de la ficha.
     *
     * @param {josn} card - Ficha especificada.
     */
    setInfoSelectedCard(card) {
      this.$store.commit("setMathpadSelectedCard", { card });
    },

    /**
     * Acciones del doble click al presional el mouse hacia abajo.
     */
    dblClickSensor() {
      // Contar click
      this.doubleClick.clicks++;

      // Si es el primer click
      if (this.doubleClick.clicks === 1) {
        // Crear un temporizador para contar el segundo click
        var self = this;
        self.doubleClick.timer = setTimeout(function() {
          self.doubleClick.clicks = 0;
        }, self.doubleClick.delay);
      }
      // Si es el segundo click
      else {
        // Lanzar evento del doble click y reiniciar acciones
        this.onDblClick();
        clearTimeout(this.doubleClick.timer);
        this.doubleClick.clicks = 0;
      }
    }
  },
  computed: {
    /**
     * Validar si se deben mostrar los controles.
     */
    showControllers() {
      return this.$store.state.mathpad.canvasControllers;
    },

    grid() {
      return this.$store.state.mathpad.grid;
    }
  },
  watch: {
    /**
     * Escuchar si se deben mostrar los controles.
     */
    showControllers(newCount, oldCount) {
      // Si se deben mostrar los controles
      if (newCount) {
        this.moveable.zoom = 1;
      } else {
        this.moveable.zoom = 0;
      }
    }
  },
  // Acciones al actualizar el componente
  updated: function() {
    // Sincronizar zoom del lienzo con el arrastrado de la ficha
    this.$refs.moveable.updateRect();
  }
};
</script>

<style>
.moveableCanvas {
  overflow: hidden;
  pointer-events: fill;
  margin: auto;
  margin-top: 30px;
  width: 800px;
  height: 500px;
  background: #ffffff;
  box-shadow: 0px 3px 30px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
}
.mathCanvas {
  pointer-events: fill;
  width: 100%;
  height: 100%;
  position: relative;
}
.mathCanvasGrid {
  background-image: linear-gradient(var(--border-color-6) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color-6) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
