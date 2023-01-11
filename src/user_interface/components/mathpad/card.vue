<template>
  <!-- Componente que permite mover la ficha -->
  <Moveable
    ref="moveable"
    class="moveableCard"
    v-bind="moveable"
    @drag="handleDrag"
    @scale="handleScale"
    @rotate="handleRotate"
  >
    <!-- Componente que muestra la representación gráfica del LaTeX -->
    <div
      :class="'card'"
      v-katex:display="{
        expression: equation.trim() || '\\textcolor{red}{?}',
        options: { throwOnError: false, errorColor: 'red' }
      }"
      v-on:mousedown="onMouseDown"
      v-on:touchstart="onMouseDown"
    ></div>
    <!-- Cargando -->
    <div v-if="cardJson.loading" class="card-loading-container">
      <img class="card-loading" :src="ilustations.loading" />
    </div>
  </Moveable>
</template>

<script>
import canvasController from "../../../controllers/canvasController";
/**
 * Componente para la ficha matemática.
 * <pre>
 * - Muestra la representación gráfica de una ecuación LaTeX.
 * - Es seleccionable.
 * - Es arrastrable.
 * - Es es redimensionable. (Conservando el ratio)
 * - Es rotable.
 * - Es acoplable en el parametro de otras fichas.
 * - Sus parametros son desacoplables.
 * </pre>
 * @module interface-components-mathpad-card
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import cardController from "../../../controllers/cardController";

/**
 * @vue-prop {json} cardJson - Información de la ficha matemática.
 *
 * @vue-data {module} cardController - Controlador de la ficha.
 * @vue-data {string} equation - LaTeX final para graficación.
 * @vue-data {string} lastEquation - LaTeX de la graficación anterior.
 * @vue-data {boolean} [activateSimulateMouseDown=false] - Estado del mousedown simulado.
 * @vue-data {json} moveable - Propiedades de la libreria de movimiento y redimensionamiento.
 * @vue-data {boolean} [moveable.draggable=true] - Permitir arrastrabilidad.
 * @vue-data {boolean} [moveable.keepRatio=true] - Mantener proporciones originales.
 * @vue-data {boolean} [moveable.scalable=true] - Permitir redimensionalidad.
 * @vue-data {boolean} [moveable.renderDirections=["nw", "ne", "se", "sw"]] - Renderizar controles de los extremos especificados.
 * @vue-data {boolean} [moveable.rotatable=true] - Permitir rotabilidad.
 * @vue-data {boolean} [moveable.zoom=0] - Tamaño de los controles.
 * @vue-data {boolean} [back=false] - Valida si la ficha esta en su capa actual o en el fondo.
 * @vue-data {json} doubleClick - Propiedades del doble click programado manualmente.
 * @vue-data {boolean} [doubleClick.clicks=0] - Numero de clicks del mouse detectados.
 * @vue-data {boolean} [doubleClick.delay=400] - Tiempo de espera en milisegundos para aceptar el doble click.
 * @vue-data {function} [doubleClick.timer=null] - Temporizador de tiempo que se activa desde el primer click.
 *
 * @vue-event {undefined} canvasDraggerBlocker(boolean:state) - Bloquear arrastrado del canvas.
 * @vue-event {undefined} setSelectedCardParam(json:paramCard,integer:pos) - Asignar ficha en la posición de un parametro de la ficha actual.
 * @vue-event {undefined} getSelectedCardParam(json:cardContent,integer:pos) - Extraer ficha de la posición de un parametro de la ficha actual.
 * @vue-event {undefined} simulateMouseDown - Lanzar mouse down simulado.
 */
export default {
  name: "card",
  props: ["cardJson"],
  data() {
    return {
      cardController: cardController,
      equation: cardController.getRenderLaTeX(this.cardJson),
      lastEcuation: "Error",
      activateSimulateMouseDown: false,
      moveable: {
        draggable: true,
        keepRatio: true,
        scalable: true,
        renderDirections: ["nw", "ne", "se", "sw"],
        rotatable: true,
        zoom: 0
      },
      back: false,
      doubleClick: {
        clicks: 0,
        delay: 400,
        timer: null
      },
      ilustations: {
        loading: `./../../../../public/svg/loading.gif`
      }
    };
  },
  methods: {
    /**
     * Actualizar renderizado de la formula LaTeX
     */
    updateCard() {
      this.lastEcuation = this.equation;
      this.equation = this.cardController.getRenderLaTeX(
        this.cardJson,
        this.$store.state.mathpad.writingParam
      );
      this.cardJson.update = false;
    },

    /**
     * Manejador de los cambios al arrastrar la ficha.
     *
     * @param {json} params - Parametros de la función.
     * @param {object} params.target - Elemento HTML que contiene la ficha.
     * @param {object} params.transform - Transformación realizada al arrastrar la ficha.
     */
    handleDrag({ target, transform, clientX, clientY }) {
      // Enviar la ficha al fondo para poder detectar los eventos de las otras fichas mientras se arrastra
      this.sendToBack();

      // Sincronizar zoom del lienzo con el arrastrado de la ficha
      this.$refs.moveable.updateRect();

      // Si la ficha viene como resultado de un desacoplamiento
      if (this.cardJson.inDragger) {
        // Asignar coordenadas de la ficha en la posición del mouse
        var domRect = document
          .getElementById("mathCanvas")
          .getBoundingClientRect();
        var cardRect = document
          .getElementById("card" + this.cardJson.id)
          .getBoundingClientRect();
        var results = this.cardJson.bounds.transform.match(
          /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/
        );
        var mouseX =
          clientX - domRect.x - (cardRect.width * parseInt(results[1])) / 2;
        var mouseY =
          clientY - domRect.y - (cardRect.height * parseInt(results[4])) / 2;
        this.cardJson.bounds.transform = transform.replace(
          /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/,
          `matrix(${results[1]},${results[2]},${results[3]},${results[4]},${results[5]},${results[6]}) translate(${mouseX}px, ${mouseY}px)`
        );
      } else {
        this.cardJson.bounds.transform = transform;
      }
      return false;
    },

    /**
     * Manejador de los cambios al redimensionar la ficha.
     *
     * @param {json} params - Parametros de la función.
     * @param {object} params.target - Elemento HTML que contiene la ficha.
     * @param {object} params.transform - Transformación realizada al redimensionar la ficha.
     */
    handleScale({ target, transform, scale }) {
      this.cardJson.bounds.transform = transform;
    },

    /**
     * Manejador de los cambios al rotar la ficha.
     *
     * @param {json} params - Parametros de la función.
     * @param {object} params.target - Elemento HTML que contiene la ficha.
     * @param {object} params.transform - Transformación realizada al rotar la ficha.
     */
    handleRotate({ target, transform }) {
      this.cardJson.bounds.transform = transform;
    },

    /**
     * Acciones al realizar doble click.
     * <pre>
     * - Bloquea el click y el doble click del lienzo.
     * - Muestra u oculta los controles de transformación de la ficha.
     * </pre>
     */
    onDblClick() {
      if (this.moveable.zoom !== 0) {
        this.hideUtils();
      } else {
        this.showUtils();
      }
    },

    /**
     * Mostrar los controles de transformación de la ficha.
     */
    showUtils() {
      // Actualizar posición del rectangulo de los controles
      this.$refs.moveable.updateRect();

      // Mostrar controles
      this.$store.commit("setControllersTo", { card: this.cardJson });
    },

    /**
     * Ocultar los controles de transformación de la ficha.
     */
    hideUtils() {
      this.$store.commit("setControllersTo", { card: null });
    },

    /**
     * Acciones al presionar el mouse hacia abajo en la ficha.
     * <pre>
     * - Asignar esta ficha como ficha seleccionada.
     * - Asignar esta ficha como ficha que se está arrastrando.
     * - Bloquear arrastrado del lienzo.
     * - Enviar la ficha al fondo.
     * - Enviar señal del mouse al sensor de doble click.
     * </pre>
     *
     * @param {object} event - Propiedades del evento del mouse.
     */
    onMouseDown() {
      // Sincronizar zoom del lienzo con el arrastrado de la ficha
      this.$refs.moveable.updateRect();

      // Si la ficha se puede arrastrar
      if (this.moveable.draggable) {
        // Bloquear arrastrado del lienzo
        this.$emit("canvasDraggerBlocker", false);

        // Asignar esta ficha como ficha que se está arrastrando
        this.$store.commit("setMathpadDraggedCard", {
          draggedCard: this.cardJson
        });

        // Enviar la ficha al fondo para poder detectar los eventos de las otras fichas mientras se arrastra
        this.sendToBack();

        // Enviar señal del mouse al sensor de boble click
        this.dblClickSensor();
      }

      // Si se está arrastando una ficha
      if (this.$store.state.mathpad.draggedCard) {
        // Asignar esta ficha como ficha seleccionada
        this.$store.commit("setMathpadSelectedCard", {
          selectedCard: this.$store.state.mathpad.draggedCard
        });
      } else {
        // Asignar esta ficha como ficha seleccionada
        this.$store.commit("setMathpadSelectedCard", {
          selectedCard: this.cardJson
        });
      }
    },

    /**
     * Acciones al soltar el mouse de la ficha.
     * <pre>
     * - Desbloquear arrastrabilidad de la ficha.
     * - Desbloquear arrastrabilidad de lienzo.
     * - Desasignar ficha que se estaba arrastrando.
     * - Enviar ficha a su capa inicial.
     * </pre>
     */
    onMouseUp() {
      // Desbloquear arrastrabilidad de la ficha
      this.moveable.draggable = true;

      // Establecer que la ficha contenedora ya no se está arrastrando
      delete this.cardJson.inDragger;

      // Desbloquear arrastrabilidad de lienzo
      this.$emit("canvasDraggerBlocker", true);

      // Desasignar ficha que se estaba arrastrando
      this.$store.commit("setMathpadDraggedCard", {
        draggedCard: null
      });

      // Enviar ficha a su capa inicial
      this.sendToInitial();

      // Asignar desacoplable
      this.cardJson.unacoplable = true;
    },

    /**
     * Enviar ficha al fondo.
     */
    sendToBack() {
      this.back = true;
    },

    /**
     * Enviar ficha a su capa inicial.
     */
    sendToInitial() {
      this.back = false;
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
    },

    /**
     * Asignar los eventos de los parametros de una ficha recursivamente.
     *
     * @param {card} card - Ficha matemática a la cual se le asignarán los eventos.
     */
    setParamEvents(card) {
      // Para cada parámetro
      for (const i in card.params) {
        // Obtener contexto actual
        const self = this;

        // Obtener elementos HTML del parametro de la ficha
        const id = "param." + card.id + "." + (parseInt(i) + 1);
        var elements = document.querySelectorAll("[id='" + id + "']");

        // Para cada coincidencia del parametro
        for (const element of elements) {
          // Añadir evento de soltar el mouse al parametro
          element.addEventListener(
            "mouseup",
            function() {
              self.paramMouseUp(card, i);
            },
            false
          );
          element.addEventListener(
            "touchend",
            function() {
              self.paramTouchEnd();
            },
            false
          );

          //  Añadir evento de presionar el mouse al parametro
          element.addEventListener(
            "mousedown",
            function(event) {
              self.paramMouseDown(card, i, event);
            },
            false
          );
          //  Añadir evento de presionar el mouse al parametro
          element.addEventListener(
            "touchstart",
            function(event) {
              self.paramTouchStart(card, i, event.touches[0]);
            },
            false
          );
        }

        // Si el parametro está asignado
        if (card.params[i].content) {
          // Asignar eventos a la subficha
          self.setParamEvents(card.params[i].content);
        }
      }
    },

    /**
     * Acciones de un parámetro al presionar el mouse sobre él.
     * <pre>
     * - Extraer ficha del parametro.
     * - Asignar sus nuevas coordenadas de acuerdo a las coordenadas del mouse.
     * - Establecer que la ficha extraida se está arrastrando.
     * </pre>
     *
     * @param {card} card - Ficha matemática que tiene el parametro presionado.
     * @param {integer} pos - Posición del parametro presionado en la ficha.
     */
    paramMouseDown(card, pos, event) {
      // Si la ficha no está bloqueada y el parametro está asignado
      if (
        this.moveable.draggable &&
        card.params[pos].content &&
        typeof card.params[pos].content != "string" &&
        this.cardJson.unacoplable
      ) {
        // Bloquear ficha (Evitar que se desacoplen las fichas padre)
        this.moveable.draggable = false;

        // Asignar coordenadas de la ficha en la posición del mouse
        var domRect = document
          .getElementById("mathCanvas")
          .getBoundingClientRect();
        var mouseX =
          event.clientX / this.$store.state.mathpad.scale -
          domRect.x / this.$store.state.mathpad.scale;
        var mouseY =
          event.clientY / this.$store.state.mathpad.scale -
          domRect.y / this.$store.state.mathpad.scale;
        var results = this.cardJson.bounds.transform.match(
          /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/
        );
        card.params[pos].content.bounds = {
          scale: 1,
          transform: ""
        };
        card.params[
          pos
        ].content.bounds.transform = this.cardJson.bounds.transform.replace(
          /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/,
          `matrix(${results[1]},${results[2]},${results[3]},${
            results[4]
          },${0},${0}) translate(${mouseX}px, ${mouseY}px)`
        );

        // Establecer que la ficha extraida se está arrastrando
        card.params[pos].content.inDragger = true;

        // Asginar escala del contenedor
        card.params[pos].content.bounds.scale = this.cardJson.bounds.scale;

        // Asignar desplazamiento de origen
        card.params[pos].content.bounds.deltaActive = true;
        card.params[pos].content.bounds.deltaX =
          event.clientX / this.$store.state.mathpad.scale;
        card.params[pos].content.bounds.deltaY =
          event.clientY / this.$store.state.mathpad.scale;

        // Establecer que la nueva ficha no es desacoplable aún
        card.params[pos].content.unacoplable = false;

        // Extraer ficha del parametro
        this.$emit("getSelectedCardParam", card, pos);
      } else {
        // Bloquear desacoplamiento de la ficha (Evita que se no se pueda abrir el input del parmátro)
        if (this.cardJson.unacoplable) {
          this.cardJson.unacoplable = false;
          this.$store.commit("setWritingParam", {
            cardRoot: this.cardJson,
            param: card.params[pos]
          });
        }
      }
    },

    paramTouchStart(card, pos, event) {
      if (
        this.moveable.draggable &&
        card.params[pos].content &&
        typeof card.params[pos].content != "string" &&
        this.cardJson.unacoplable
      ) {
        card.params[pos].content.touch = true;
      }
      this.paramMouseDown(card, pos, event);
      //this.paramMouseUp(card, pos);
    },

    /**
     * Acciones de un parámetro al soltar el mouse de él.
     * <pre>
     * - Acoplar parametro en la ficha contenedora.
     * - Establecer que la ficha contenedora ya no se está arrastrando.
     * - Desbloquear ficha contenedora.
     * </pre>
     *
     * @param {card} card - Ficha matemática que tiene el parametro soltado.
     * @param {integer} pos - Posición del parametro soltado en la ficha.
     */
    paramMouseUp(card, pos) {
      // Si la ficha no es está redimensionando (Para que no se acople a si misma en el redimensionamiento cuando se cruza con un parametro)
      if (this.moveable.zoom === 0 && this.cardJson.unacoplable) {
        // Acoplar parametro en la ficha contenedora.
        this.$emit("setSelectedCardParam", this.cardJson, card, pos);
      }

      // Establecer que la ficha contenedora ya no se está arrastrando
      this.cardJson.inDragger = false;

      // Desbloquear ficha contenedora
      this.moveable.draggable = true;
    },

    paramTouchEnd() {
      // Establecer que la ficha contenedora ya no se está arrastrando
      this.cardJson.inDragger = false;

      // Desbloquear ficha contenedora
      this.moveable.draggable = true;
    },

    /**
     * Acciones al detectar un error en Katex
     */
    onKatexError() {
      // Asigmnar mensaje de error
      this.equation = "\\textcolor{red}{" + this.lastEcuation + "}";
    },

    onTouchEnd(event) {
      var domRect = document
        .getElementById("mathCanvas")
        .getBoundingClientRect();
      canvasController.addParamByCordinates(
        this.cardJson,
        event.changedTouches[0].clientX - domRect.x,
        event.changedTouches[0].clientY - domRect.y
      );
    }
  },

  watch: {
    // Acualizar ficha al detectar cambios en el Json de la ficha.
    cardJson: {
      deep: true,
      handler() {
        this.updateCard();
      }
    },
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
    },
    /**
     * Escuchar si se deben mostrar los controles.
     */
    loadingResult(newCount, oldCount) {
      this.loading = newCount;
    },

    selected(newCount, oldCount) {
      this.updateCard();
    },

    transform(newCount, oldCount) {
      this.$refs.moveable.$el.style.transform = newCount;
    },

    selectedClass(newCount) {
      var documentCard = document.getElementById("card" + this.cardJson.id);
      if (documentCard.classList.contains("card-programing")) {
        documentCard.classList.remove("card-programing");
      }
      if (documentCard.classList.contains("card-selected")) {
        documentCard.classList.remove("card-selected");
      }
      if (newCount !== "") {
        documentCard.classList.add(newCount);
      }
    },

    levelClass(newCount) {
      var documentCard = document.getElementById("card" + this.cardJson.id);
      if (documentCard.classList.contains("backMoveableCard")) {
        documentCard.classList.remove("backMoveableCard");
      }
      if (documentCard.classList.contains("frontMoveableCard")) {
        documentCard.classList.remove("frontMoveableCard");
      }
      if (newCount !== "") {
        documentCard.classList.add(newCount);
      }
    }
  },

  // Acciones al montar el componente
  mounted: function() {
    // Verificar si hay un error en la formula Latex
    if (this.$el.getElementsByClassName("katex-display").length === 0) {
      this.onKatexError();
      return;
    }

    // Añadir evento de soltar el mouse (Se aplica en el componente base para que se detecte el evento fuera de sus limites)
    document.addEventListener("mouseup", this.onMouseUp, false);
    document.addEventListener("touchend", this.onMouseUp, false);
    document
      .getElementById("card" + this.cardJson.id)
      .addEventListener("touchend", this.onTouchEnd, false);

    // Asignar eventos a los parametros de la ficha
    const self = this;
    this.$nextTick(function() {
      self.setParamEvents(self.cardJson);
    });

    // Si la ficha viene como resultado de un desacoplamiento
    if (this.cardJson.inDragger) {
      // Centrar elemento en la posición del mouse `translate (${mouseX}px, ${mouseY}px)`
      var results = this.cardJson.bounds.transform.match(
        /translate\((.*)px, (.*)px\)/
      );
      this.cardJson.bounds.transform = this.cardJson.bounds.transform.replace(
        /translate\((.*)px, (.*)px\)/,
        `translate(${parseInt(results[1]) -
          this.$el.clientWidth / 2}px, ${parseInt(results[2]) -
          this.$el.clientHeight / 2}px)`
      );
      // simular el presionar el mouse hacia abajo para que la ficha se aarastre
      if (!this.cardJson.touch) {
        this.$emit("simulateMouseDown");
        this.$refs.moveable.request("draggable");
        this.onMouseDown();
      } else {
        this.cardJson.touch = false;
      }
    }

    // Si la ficha viene como resultado de un proceso de solución
    if (this.cardJson.solvedOf) {
      // Ubicar ficha resultado debajo de la original (Corrige el corrimiento por escalamaiento de la ficha)
      var cardRect = document
        .getElementById("card" + this.cardJson.solvedOf.id)
        .getBoundingClientRect();
      var results = this.cardJson.solvedOf.bounds.transform.match(
        /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/
      );
      this.cardJson.bounds.transform = this.cardJson.solvedOf.bounds.transform.replace(
        /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/,
        `matrix(${results[1]},${results[2]},${results[3]},${results[4]},${
          results[5]
        },${results[6]}) translate(${results[7]}px, ${parseInt(results[8]) +
          cardRect.height}px)`
      );
      this.cardJson.solvedOf = false;
    }

    // Asignar transform
    this.$refs.moveable.$el.style.transform = this.cardJson.bounds.transform;

    // Asignar clases actuales
    if (this.selected) {
      document
        .getElementById("card" + this.cardJson.id)
        .classList.add("card-selected");
    }

    // Asignar tamaño
    this.cardJson.bounds.width = document
      .getElementById("card" + this.cardJson.id)
      .getBoundingClientRect().width;
    this.cardJson.bounds.height = document
      .getElementById("card" + this.cardJson.id)
      .getBoundingClientRect().height;
  },

  // Acciones al actualizar el componente
  updated: function() {
    // Sincronizar zoom del lienzo con el arrastrado de la ficha
    this.$refs.moveable.updateRect();

    // Verificar si hay un error en la formula Latex
    if (this.$el.getElementsByClassName("katex-display").length === 0) {
      this.onKatexError();
      return;
    }

    // Asignar eventos a los parametros de la ficha
    const self = this;
    this.$nextTick(function() {
      self.setParamEvents(self.cardJson);
    });
  },

  computed: {
    /**
     * Validar si se está seleccionando la ficha actual
     */
    selected() {
      return this.cardJson === this.$store.state.mathpad.selectedCard;
    },

    /**
     * Validar si se está programando la ficha actual
     */
    programing() {
      //return this.cardJson === this.$store.state.mathpad.programingCard;
      return false;
    },

    /**
     * Validar si se deben mostrar los controles.
     */
    showControllers() {
      //return this.$store.state.mathpad.elementWithControllers === this.cardJson;
      return false;
    },

    transform() {
      return this.cardJson.bounds.transform;
    },

    selectedClass() {
      return this.programing
        ? "card-programing"
        : this.selected
        ? "card-selected"
        : "";
    },

    levelClass() {
      return this.back
        ? "backMoveableCard"
        : this.selected
        ? "frontMoveableCard"
        : "";
    }
  }
};
</script>

<style lang="scss">
.card {
  display: inline-block;
  pointer-events: visiblePainted;
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  cursor: initial;
}
.card:hover {
  cursor: pointer;
}
.moveableCard {
  display: inline-block;
  pointer-events: visiblePainted;
  position: absolute;
  z-index: 1;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  border: 2px solid rgba(0, 0, 0, 0) !important;
  border-radius: 10px;
}
.backMoveableCard {
  z-index: 0;
}
.frontMoveableCard {
  z-index: 2;
}
.moveable-line {
  background: var(--background-color-8) !important;
}
.emptyParam {
  position: relative;
  z-index: 9999;
  border: 2px solid rgba(0, 0, 0, 0) !important;
  border-radius: 5px;
}
.emptyParam:hover {
  color: #95b3ff;
  cursor: pointer;
}
.fillParam {
  position: relative;
  z-index: 9999;
  border: 2px solid rgba(0, 0, 0, 0) !important;
  border-radius: 5px;
}
.fillParam:hover {
  color: #0646e8;
  cursor: pointer;
}
.writingParam {
  color: #000000;
  border: 2px solid var(--border-color-3) !important;
  border-radius: 5px;
  position: relative;
  z-index: 9999;
}
.nonWritingParam {
  position: relative;
  z-index: 9999;
}
.nonWritingParam:hover {
  color: #ffa70d;
  cursor: pointer;
}
.rCS53a2i7 .moveable-control {
  background: var(--background-color-8) !important;
  border-radius: 0% !important;
  border: 0px solid var(--background-color-8) !important;
}
.rCS53a2i7 .moveable-rotation {
  border-radius: 50% !important;
}
.card-selected {
  background-color: rgba(255, 255, 255, 0.6);
  border: 2px solid var(--border-color-5) !important;
  border-radius: 10px;
  outline-offset: 0px;
}
.card-programing {
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--border-color-5) !important;
  border-radius: 10px;
  outline-offset: 0px;
}
.katex-display {
  display: block;
  margin: 0px !important;
  padding: 5px !important;
  text-align: center;
}
.katex {
  display: block;
  margin: 0px !important;
  padding: 0px !important;
  text-align: center;
}
.card-loading {
  position: absolute;
  width: 40px;
  z-index: 2;
  left: calc(50% - 20px);
  top: 0px;
  pointer-events: none;
}
.card-loading-container {
  z-index: 2;
  position: relative;
  pointer-events: none;
}
</style>
