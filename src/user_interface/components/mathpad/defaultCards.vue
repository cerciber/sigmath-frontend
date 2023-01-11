<template>
  <!-- Contenido HTML -->
  <!-- Llamado a los elementos del data -->
  <div>
    <!-- Categorias -->
    <div
      id="default-cards-categories"
      v-for="(cardsCategory, index) in this.cardsCategories"
      :key="cardsCategory.id"
    >
      <div
        v-b-toggle="'collapse-' + index"
        class="font-normal-3 default-card-category"
        v-on:click="onToggleClick(cardsCategory, 'collapse-' + index)"
      >
        <div class="default-cards-arrow" v-show="cardsCategory.expanded">
          &#9660;
        </div>
        <div class="default-cards-arrow" v-show="!cardsCategory.expanded">
          &#9658;
        </div>
        <div class="default-cards-category">{{ cardsCategory.category }}</div>
      </div>
      <b-collapse
        v-bind:id="'collapse-' + index"
        :ref="'collapse-' + index"
        class="default-card-category-content"
      >
        <!-- Card por categoria -->
        <div
          class="default-cards"
          v-for="defaultCard in cardsCategory.content"
          :key="defaultCard.id"
        >
          <defaultCard
            v-bind:defaultCard="defaultCard"
            v-bind:expanded="cardsCategory.expanded"
          ></defaultCard>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
/**
 * Ingrese la descripción del modulo
 *
 * @module defaultCardsVue
 * @author Labeleon <labeleon@gmail.com>
 */

import defaultCardsJSON from "./../../../local_storage/defaultCards.json";
import cardController from "./../../../controllers/cardController";
import canvasController from "./../../../controllers/canvasController";
import defaultCard from "./defaultCard";
import BIcon from "bootstrap-vue";

// Contendio JS
export default {
  name: "defaultCards",
  components: { defaultCard },
  props: { card: Object },
  data() {
    return {
      cardsCategories: defaultCardsJSON
    };
  },
  methods: {
    onToggleClick(cardsCategory, collapseRef) {
      if (!cardsCategory.expanded) {
        cardsCategory.expanded = true;
      } else {
        cardsCategory.expanded = false;
      }
      this.$refs[collapseRef][0].show = cardsCategory.expanded;
    }
  }
};
</script>

<style lang="scss">
.default-card-category {
  color: var(--text-color-2);
  position: relative;
  height: 21px;
  padding-left: 24px;
  margin-top: 12px;
}

.default-card-category[aria-expanded="true"] {
  background-color: var(--background-color-10);
}

.default-card-category-content {
  width: calc(100% - 40px);
  display: flex;
  flex-wrap: wrap;
}

.default-cards {
  border-bottom: 2px solid var(--border-color-3);
  position: relative;
  left: 35px;
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
}

.default-card-title {
  color: var(--text-color-2);
  position: relative;
  margin-bottom: 5px;
  word-wrap: break-word;
}

.default-card-container {
  background-color: var(--background-color-5);
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  justify-content: center;
  margin: 0px !important;
  padding: 0px !important;
  cursor: pointer;
}

.rendered-default-card {
  margin: 0px !important;
  padding: 0px !important;
}

.default-card-description {
  color: var(--text-color-2);
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
  word-wrap: break-word;
}
.default-cards-arrow {
  color: var(--text-color-4);
  display: inline;
  margin-right: 5px;
  font-size: 10px;
}

.default-cards-category {
  display: inline;
}
</style>
