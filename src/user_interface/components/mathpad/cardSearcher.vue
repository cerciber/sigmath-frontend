<template>
  <div>
    <!-- Titulo de la búsqueda -->
    <div class="font-normal-3 card-searcher-title">
      Por título o descripción:
    </div>
    <!-- Campo de búsqueda -->
    <b-form-input
      class="input-text-1 font-normal-1 card-searcher-input"
      placeholder="Ingrese un texto"
      v-model="text"
      @keydown.native="searchInputEnter"
    ></b-form-input>
    <!-- Botón para búscar -->
    <b-button
      class="button-1 font-normal-3 card-searcher-button"
      v-on:click="searchCard"
    >
      Buscar
    </b-button>
    <!-- Cargando -->
    <div v-if="loading" class="card-searcher-loading-container">
      <img class="card-searcher-loading" :src="ilustations.loading" />
    </div>
  </div>
</template>

<script>
/**
 * Componente para buscar fichas en la base de datos.
 *
 * @module interface-components-mathpad-card-searcher
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
import searchCardAgent from "../../../service_agents/searchCardAgent";

/**
 * @vue-data {string} [text=""] - Texto de busqueda (Coincidencias en el titulo o la descripción de una ficha).
 */
export default {
  name: "cardSearcher",
  data() {
    return {
      text: "",
      loading: false,
      ilustations: {
        loading: `./../../../../public/svg/loading.gif`
      }
    };
  },
  methods: {
    /**
     * Buscar fichas en la base de datos en base al texto ingresado.
     */
    searchCard() {
      // Verificar si hay algun campo vacio
      if (this.text.trim() === "") {
        this.$store.commit("setNotification", {
          text: "El campo de búsqueda no puede estar vacío.",
          type: "warning",
          duration: 5
        });
        return;
      }

      this.loading = true;

      searchCardAgent(this.text, (state, data) => {
        // Si se obtuvieron resultados
        if (state === 200) {
          // Asignar resultados
          this.$store.commit("setMathpadResults", { results: data });
          // Mostrar panel de resultados
          this.$store.commit("showResults");
        }

        // Si no se encontraron resultados
        else if (state === 404) {
          this.$store.commit("setNotification", {
            text: data,
            type: "warning",
            duration: 5
          });
        }

        // Si hubo algun otro error
        else {
          this.$store.commit("setNotification", {
            text: data,
            type: "danger",
            duration: 5
          });
        }

        this.loading = false;
      });
    },

    searchInputEnter(event) {
      if (event.which === 13) {
        this.searchCard();
      }
    }
  }
};
</script>

<style>
.card-searcher-title {
  color: var(--text-color-2);
  position: relative;
  margin-left: 20px;
  margin-bottom: 6px;
}
.card-searcher-input {
  width: calc(100% - 40px);
  height: 35px;
  margin-left: 20px;
}
.card-searcher-button {
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-top: 11px;
}
.card-searcher-loading {
  position: absolute;
  width: 40px;
  z-index: 2;
  left: calc(50% - 20px);
  top: 2px;
  pointer-events: none;
}
.card-searcher-loading-container {
  z-index: 2;
  position: relative;
  pointer-events: none;
}
</style>
