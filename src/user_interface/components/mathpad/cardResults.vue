<template>
  <!-- Contendor del panel de resultados con su covertura oscura -->
  <div
    :class="[
      'results-back',
      state === 'initial'
        ? ''
        : state === 'show'
        ? 'results-back-show'
        : 'results-back-hide'
    ]"
  >
    <!-- Panel de resultados-->
    <div class="results-frame">
      <!-- Panel superior-->
      <div class="results-top">
        <!-- Titulo -->
        <div class="results-title">Resultados:</div>
        <!-- Icono para cerrar el panel -->
        <Close class="results-close-icon" v-on:click="hideResults" />
      </div>
      <!-- Espacio de resultados -->
      <div class="results-space">
        <!-- Lista de fichas resultado -->
        <cardResult
          v-bind:card="card"
          :parent="'cardResults'"
          v-on:hideResults="hideResults"
          v-for="card in cards"
          :key="'cardResult' + card.ID_CARD"
        ></cardResult>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Componente para mostrar una ficha del resultado de una busqueda.
 *
 * @module interface-components-mathpad-card-results
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Close from "vue-material-design-icons/Close.vue";

// Modulos creados
import cardResult from "./cardResult";

/**
 * @vue-computed {json[]} cards - Lista de fichas matemáticas del resultado.
 * @vue-computed {string} state - Estado del panel del resultado para las animaciones ("initial", "show", "hide").
 */
export default {
  name: "cardResults",
  components: { Close, cardResult },
  computed: {
    cards() {
      return this.$store.state.mathpad.results;
    },
    state() {
      return this.$store.state.mathpad.resultsState;
    }
  },
  methods: {
    /**
     * Cerrar el panel de resultados.
     */
    hideResults() {
      this.$store.commit("hideResults");
    }
  },
  mounted: function() {
    this.$store.commit("initialResults");
  }
};
</script>

<style>
.results-back {
  background-color: rgba(0, 0, 0, 0.4);
  padding-left: 25px;
  padding-top: 25px;
  padding-right: 25px;
  padding-bottom: 0px;
  min-height: 100%;
  display: flex;
  transform: translate(0%, 100%);
  z-index: 2;
}

@media only screen and (max-width: 768px) {
  .results-back {
    padding: 0px;
  }
}

.results-back-show {
  animation-name: results-back-animation-in;
  animation-duration: 1s;
  transform: translate(0%, 0%);
}
.results-back-hide {
  animation-name: results-back-animation-out;
  animation-duration: 1s;
  transform: translate(0%, 100%);
}
@keyframes results-back-animation-in {
  0% {
    transform: translate(0%, 100%);
  }
  100% {
    transform: translate(0%, 0%);
  }
}
@keyframes results-back-animation-out {
  0% {
    transform: translate(0%, 0%);
  }
  100% {
    transform: translate(0%, 100%);
  }
}
.results-frame {
  background-color: #98a6c9;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
}
.results-top {
  background-color: #02174c;
  width: 100%;
  height: 49px;
}
.results-title {
  color: #ffffff;
  display: flex;
  align-items: center;
  margin-left: 20px;
  height: 100%;
  font-family: "Signika Negative";
  font-style: normal;
  font-size: 18px;
  line-height: 22px;
  float: left;
}
.results-close-icon {
  display: flex;
  margin-right: 10px;
  margin-top: -1px;
  align-items: center;
  height: 100%;
  color: #6a94ff;
  float: right;
}
.results-close-icon:hover {
  cursor: pointer;
  color: #ffffff;
}
.results-space {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: calc(100% - 49px);
  overflow: auto;
}
</style>
