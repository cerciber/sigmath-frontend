<template>
  <div
    ref="defaultCardRef"
    v-bind:style="{
      width: offsetWidth
    }"
  >
    <!-- Titulo de la card -->
    <div class="font-normal-1 default-card-title">
      {{ defaultCard.title }}
    </div>
    <!-- Contenedor de la card -->
    <div
      class="default-card-container"
      v-on:click="createDefualtCard(defaultCard)"
    >
      <!--
            <img src="./../../../../public/svg/testCard.svg" />
            -->
      <!-- Renderizado de la card -->
      <div
        ref="defaultCardExpressionRef"
        class="rendered-default-card"
        v-katex:display="{
          expression:
            rederDefaultCards(defaultCard).trim() || '\\textcolor{red}{?}'
        }"
      ></div>
    </div>
    <!-- Descripción de la card -->
    <div class="font-small-1 default-card-description">
      {{ defaultCard.description }}
    </div>
  </div>
</template>

<script>
import cardController from "./../../../controllers/cardController";
import canvasController from "./../../../controllers/canvasController";

// Contendio JS
export default {
  name: "name",
  props: ["defaultCard", "expanded"],
  data() {
    return {
      offsetWidth: 0
    };
  },
  methods: {
    //Retornar latex renderizado de la ficha
    rederDefaultCards(defaultCard) {
      return cardController.getRenderLaTeXNoEvents(defaultCard);
    },
    //Añadir ficha a la lista
    createDefualtCard(defaultCard) {
      defaultCard = canvasController.addCard(defaultCard);
      defaultCard.solvedOf = this.$store.state.mathpad.selectedCard;
      // Asignar esta ficha como ficha seleccionada
      this.$store.commit("setMathpadSelectedCard", {
        selectedCard: defaultCard
      });
    }
  },
  mounted: function() {
    this.offsetWidth =
      this.$refs.defaultCardExpressionRef.clientWidth + 40 + "px";
  },
  updated: function() {
    this.offsetWidth =
      this.$refs.defaultCardExpressionRef.clientWidth + 40 + "px";
  },
  watch: {
    expanded() {
      this.offsetWidth =
        this.$refs.defaultCardExpressionRef.clientWidth + 40 + "px";
    }
  }
};
</script>

<style></style>
