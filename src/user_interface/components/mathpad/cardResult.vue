<template>
  <!-- Carta que envuelve un elemento del resultado de la búsqueda -->
  <div class="result-card">
    <!-- Representación gráfica de la formula resultado -->
    <div class="result-card-formula-content" ref="resultCardFormulaContent">
      <div
        class="result-card-formula"
        ref="resultCardFormula"
        v-bind:style="{
          transform:
            'scale(' + transforms.scaleX + ', ' + transforms.scaleY + ')'
        }"
        v-katex:display="{
          expression: equation.trim() || '\\textcolor{red}{?}'
        }"
      ></div>
    </div>
    <!-- Información de la ficha resultado -->
    <div class="result-description">
      <!-- Titulo -->
      <div class="result-description-title">{{ card.title }}</div>
      <!-- Descripción -->
      <div class="result-description-description">{{ card.description }}</div>
      <div v-if="parent == 'userCards'">
        <userCardFooter v-bind:card="card"></userCardFooter>
      </div>
      <div v-else-if="parent == 'cardResults'">
        <div class="result-button-content">
          <b-button
            class="btn-primary shadow-none result-button"
            v-on:click="addCard"
            >Usar fórmula</b-button
          >
        </div>
      </div>
      <!-- Botón para usar formula en el lienzo -->
    </div>
  </div>
</template>

<script>
/**
 * Componente para mostrar una ficha del resultado de una busqueda.
 *
 * @module interface-components-mathpad-card-result
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import cardController from "../../../controllers/cardController";
import canvasController from "../../../controllers/canvasController";
import userCardFooter from "../userCard/userCardFooter";
/**
 * @vue-prop {json} card - Información de la ficha matemática.
 *
 * @vue-data {string} equation - LaTeX final para graficación.
 * @vue-data {json} transforms - Transformaciones del tamaño de la ficha para que se adapte a la carta ontenedora.
 * @vue-data {number} [transforms.scaleX = 2] - Transormación horizontal del tamaño.
 * @vue-data {number} [transforms.scaleX = 2] - Transormación vertical del tamaño.
 */
export default {
  name: "cardResult",
  props: { card: Object, parent: String },
  components: {
    userCardFooter
  },
  data() {
    return {
      equation: cardController.getRenderLaTeX(this.card),
      transforms: {
        scaleX: 1,
        scaleY: 1
      }
    };
  },
  methods: {
    /**
     * Actualizar el tamaño de la ficha para que se adapte a la carta ontenedora.
     */
    updateScale() {
      // Obtener tamaño horizontal
      var scaleX =
        this.$refs.resultCardFormulaContent.clientWidth /
        this.$refs.resultCardFormula.clientWidth;

      // Obtener tamaño vertial
      var scaleY =
        this.$refs.resultCardFormulaContent.clientHeight /
        this.$refs.resultCardFormula.clientHeight;

      // Asignar la escala mejor a los dos ejes para conservar la proporción
      if (scaleX > scaleY) {
        this.transforms.scaleX = scaleY;
        this.transforms.scaleY = scaleY;
      } else {
        this.transforms.scaleX = scaleX;
        this.transforms.scaleY = scaleX;
      }
    },
    /**
     * Añadir carta al lienzo.
     */
    addCard() {
      var card = canvasController.addCard(this.card);
      card.solvedOf = this.$store.state.mathpad.selectedCard;
      this.$store.commit("setMathpadSelectedCard", { selectedCard: card });
      this.$store.commit("setNotification", {
        text: "La ficha se añadió al lienzo.",
        type: "info",
        duration: 5
      });
    }
  },

  // Actualizar escala al montar componente
  mounted: function() {
    //this.updateScale();
  },

  // Actualizar escala al actualizar componente
  updated: function() {
    //this.updateScale();
  }
};
</script>

<style>
.result-card {
  box-shadow: 0px 3px 30px 5px rgba(0, 0, 0, 0.25);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 250px;
  margin-left: 23px;
  margin-right: 23px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.result-card-formula-content {
  background-color: #ffffff;
  padding: 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}
.result-description {
  background: linear-gradient(180deg, #032479 0%, #02174c 100%);
}
.result-description-title {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.result-description-description {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
  color: #ffffff;
  padding-top: 3px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  overflow: auto;
}
.result-button-content {
  text-align: center;
  padding-top: 9px;
  padding-bottom: 15px;
}
.result-button {
  margin: auto;
  width: 191.87px;
  height: 28px;
  background: #f07513;
  border-radius: 5px;
  padding: 0px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
}
.result-button:focus {
  background: #f07513 !important;
}
.result-button:active {
  background: #c55e0c !important;
}
.btn-primary:visited {
  background: #f07513 !important;
}
.btn-primary:disabled {
  background: #f07513 !important;
}
.result-button:hover {
  background: #f39244;
}
.katex-html,
.katex {
  display: inline-block !important;
}
.katex-display {
  display: inline-block !important;
  margin: 10px;
}
</style>
