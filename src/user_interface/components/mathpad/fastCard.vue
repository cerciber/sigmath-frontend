<template>
  <div>
    <b-modal
      id="fastCardModal"
      ref="fastCardModal"
      title="Nueva ficha"
      hide-footer
      centered
      modal-header-close="X"
    >
      <template v-slot:modal-header="{ close }">
        <div class="fast-card-title">Ficha rápida</div>
        <Close class="fast-card-close-icon" v-on:click="close()" />
      </template>
      <b-container class="fast-card">
        <b-row>
          <b-col cols="2">
            <!-- NO BORRAR!!! />-->
            <!--
            <b-row>
              <div class="title-list">Lista de símbolos:</div>
            </b-row>
            <b-row>
              <SymbolsList></SymbolsList>
            </b-row>
            -->
          </b-col>
          <b-col cols="11">
            <b-row>
              <div class="title-formula">Ingesa una expresión matemática:</div>
            </b-row>
            <b-row>
              <b-form-input
                id="latexArea"
                ref="latexArea"
                v-model="latexText"
                placeholder="Expresión matemática"
                class="card-fast-text-area"
                @keydown.native="addCardInputEnter"
                autofocus
              ></b-form-input>
            </b-row>
          </b-col>
        </b-row>
        <b-row align-h="center" align-v="center">
          <b-col class="add-button-col">
            <b-button class="add-button" v-on:click="addCard"
              >Crea la ficha</b-button
            >
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
/**
 * Creador de ficha rápida.
 *
 * @module interface-components-mathpad-card-fast
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Close from "vue-material-design-icons/Close.vue";

// Modulos creados
import SymbolsList from "./symbolsList";
import canvasController from "../../../controllers/canvasController";
import fastCardAgent from "../../../service_agents/fastCardAgent";

/**
 * @vue-data {string} latexText - Expresión Sympy de la ficha rápida.
 */
export default {
  name: "FastCard",
  data() {
    return {
      latexText: ""
    };
  },
  components: {
    SymbolsList,
    Close
  },
  methods: {
    /**
     * Añadir ficha al lienzo.
     */
    addCard() {
      // Verificar si hay algun campo vacio
      if (this.latexText.trim() === "") {
        this.$store.commit("setNotification", {
          text: "La expresión no puede estar vacía.",
          type: "warning",
          duration: 5
        });
        this.latexText = "";
        return;
      }

      // Cerrar
      this.$refs.fastCardModal.hide();

      fastCardAgent(this.latexText, (state, data) => {
        // Si se obtuvieron resultados
        if (state === 200) {
          var card = canvasController.addCard(data);
          card.solvedOf = this.$store.state.mathpad.selectedCard;
          this.$store.commit("setMathpadSelectedCard", { selectedCard: card });

          this.$store.commit("setNotification", {
            text: "La ficha se añadió al lienzo",
            type: "info",
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

        // Borrar
        this.latexText = "";
      });
    },
    addCardInputEnter(event) {
      if (event.which === 13) {
        this.addCard();
      }
    }
  }
};
</script>

<style>
.modal-content {
  background-color: #02174c;
  border-radius: 0px;
}
.modal-header {
  background: #02174c;
  color: white;
  font-family: Signika Negative;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  border: none;
}

.modal-body {
  background: linear-gradient(180deg, #032479 0%, #02174c 100%);
}

.fast-card {
  font-family: Titillium Web;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;

  color: #ffffff;
}
.card-fast-text-area {
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 5px;
  width: calc(100% - 40px);
  background-color: transparent;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: #b9b9b9;
}
.card-fast-text-area:focus {
  background-color: transparent;
  color: #b9b9b9;
  border: 2px solid #f07513;
  box-sizing: border-box;
  box-shadow: none;
}
.add-button-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-button {
  margin-top: 15px;
  background: #f07513;
  box-shadow: 0px 2px 10px 3px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-family: Titillium Web;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  box-shadow: none !important;
}
.add-button:focus {
  background: #f07513 !important;
}
.add-button:active {
  background: #c55e0c !important;
}
.add-button:visited {
  background: #f07513 !important;
}
.add-button:disabled {
  background: #f07513 !important;
}
.add-button:hover {
  background: #f39244 !important;
}

.title-formula {
  margin: 0px 0px 5px 0px;
}

.title-list {
  margin: 0 0 5px 0px;
}
.fast-card-close-icon {
  display: flex;
  margin-right: -2px;
  margin-top: -1px;
  align-items: center;
  height: 100%;
  color: #6a94ff;
  float: right;
}
.fast-card-close-icon:hover {
  cursor: pointer;
  color: #ffffff;
}
.fast-card-title {
  margin-top: 2px;
}
</style>
