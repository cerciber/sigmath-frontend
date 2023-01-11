<template>
  <div>
    <!-- Si existe una carta seleccionada mostrar el formulario de caracteristicas -->
    <div v-if="selectedCard !== null">
      <div
        v-b-toggle="'features-collapse-1'"
        class="font-normal-3 default-card-category"
        v-on:click="onToggleClick('features-collapse-1')"
      >
        <div
          class="default-cards-arrow"
          v-show="collapseStates['features-collapse-1']"
        >
          &#9660;
        </div>
        <div
          class="default-cards-arrow"
          v-show="!collapseStates['features-collapse-1']"
        >
          &#9658;
        </div>
        <div class="default-cards-category">Solucionadores</div>
      </div>
      <b-collapse
        v-bind:id="'features-collapse-1'"
        :ref="'features-collapse-1'"
        visible
      >
        <div class="card-feature-buttons">
          <!-- Botones de las funcionalidades -->
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="solveCard('run')"
            ><Solve></Solve> Ejecutar</b-button
          >
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="solveCard('eval')"
            ><Eval></Eval> Evaluar</b-button
          >
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="solveCard('simplify')"
            ><Simplify></Simplify> Simplificar</b-button
          >
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="solveCard('factorize')"
            ><Factorize></Factorize> Factorizar</b-button
          >
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="solveCard('expand')"
            ><Expand></Expand> Expandir</b-button
          >
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="solveCard('fractionate')"
            ><Fractionate></Fractionate> Fraccionar</b-button
          >
        </div>
      </b-collapse>
      <div
        v-b-toggle="'features-collapse-6'"
        class="font-normal-3 default-card-category"
        v-on:click="onToggleClick('features-collapse-6')"
      >
        <div
          class="default-cards-arrow"
          v-show="collapseStates['features-collapse-6']"
        >
          &#9660;
        </div>
        <div
          class="default-cards-arrow"
          v-show="!collapseStates['features-collapse-6']"
        >
          &#9658;
        </div>
        <div class="default-cards-category">Opciones</div>
      </div>
      <b-collapse
        v-bind:id="'features-collapse-6'"
        :ref="'features-collapse-6'"
        visible
      >
        <div class="card-feature-buttons">
          <!-- Botones de las funcionalidades -->
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="editCard"
            ><Edit></Edit> Editar</b-button
          >
          <b-button
            v-if="logged"
            class="button-2 font-help-2 card-feature-button"
            v-on:click="saveCard"
            ><Save></Save> Guardar</b-button
          >
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-if="
              logged &&
                selectedCard.UserCard &&
                selectedCard.UserCard.User.email === $store.state.user.email
            "
            v-on:click="updateCardConfirmation"
          >
            <Update></Update> Actualizar
          </b-button>
          <b-button
            class="button-2 font-help-2 card-feature-button"
            v-on:click="deleteCardConfirmation"
            ><Delete></Delete> Borrar</b-button
          >
        </div>
      </b-collapse>
      <div
        v-if="
          logged &&
            selectedCard.UserCard &&
            selectedCard.UserCard.User.email !== $store.state.user.email
        "
      >
        <div
          v-b-toggle="'features-collapse-2'"
          class="font-normal-3 default-card-category"
          v-on:click="onToggleClick('features-collapse-2')"
        >
          <div
            class="default-cards-arrow"
            v-show="collapseStates['features-collapse-2']"
          >
            &#9660;
          </div>
          <div
            class="default-cards-arrow"
            v-show="!collapseStates['features-collapse-2']"
          >
            &#9658;
          </div>
          <div class="default-cards-category">Calificar</div>
        </div>
        <b-collapse
          v-bind:id="'features-collapse-2'"
          :ref="'features-collapse-2'"
          visible
        >
          <div class="card-rating-container">
            <star-rating
              class="card-rating"
              :increment="0.1"
              :star-size="25"
              :show-rating="false"
              v-model="selectedCard.CardInfo.rateAvg"
              @rating-selected="cardRating"
            ></star-rating>
          </div>
        </b-collapse>
      </div>
      <!-- Lista de parámetros -->
      <div v-if="selectedCard.params.length > 0">
        <div
          v-b-toggle="'features-collapse-3'"
          class="font-normal-3 mb-2 default-card-category"
          v-on:click="onToggleClick('features-collapse-3')"
        >
          <div
            class="default-cards-arrow"
            v-show="collapseStates['features-collapse-3']"
          >
            &#9660;
          </div>
          <div
            class="default-cards-arrow"
            v-show="!collapseStates['features-collapse-3']"
          >
            &#9658;
          </div>
          <div class="default-cards-category">Símbolos de los parámetros</div>
        </div>
        <b-collapse
          v-bind:id="'features-collapse-3'"
          :ref="'features-collapse-3'"
          visible
        >
          <div class="card-feature-li">
            <div v-for="(param, i) in selectedCard.params" :key="param.id">
              <div class="font-small-2 card-feature-symbol-counter">
                {{ parseInt(i + 1) }}.
              </div>
              <div
                class="card-feature-symbol"
                v-katex:display="{
                  expression: param.symbol.trim() || '\\textcolor{red}{?}',
                  options: { throwOnError: false, errorColor: 'red' }
                }"
              ></div>
              <b-form-input
                class="input-text-1 font-normal-1 card-feature-input mt-2 mb-2"
                type="text"
                v-model="param.symbol"
                placeholder="Ingrese un simbolo LaTeX"
                @keyup.native="onKeyUp"
              />
            </div>
          </div>
        </b-collapse>
      </div>
      <!-- Titulo -->
      <div
        v-b-toggle="'features-collapse-4'"
        class="font-normal-3 default-card-category"
        v-on:click="onToggleClick('features-collapse-4')"
      >
        <div
          class="default-cards-arrow"
          v-show="collapseStates['features-collapse-4']"
        >
          &#9660;
        </div>
        <div
          class="default-cards-arrow"
          v-show="!collapseStates['features-collapse-4']"
        >
          &#9658;
        </div>
        <div class="default-cards-category">Información de la ficha</div>
      </div>
      <b-collapse
        v-bind:id="'features-collapse-4'"
        :ref="'features-collapse-4'"
      >
        <div>
          <!-- Titulo -->
          <div class="font-normal-3 card-feature-title">Titulo:</div>
          <b-form-input
            class="input-text-1 font-normal-1 card-feature-input-2"
            type="text"
            v-model="selectedCard.title"
            placeholder="Ingrese un título"
          />
          <!-- Descripción -->
          <div class="font-normal-3 card-feature-title">Descripción:</div>
          <b-form-textarea
            class="input-area-1 font-normal-1 card-feature-text-area-2"
            type="text"
            v-model="selectedCard.description"
            placeholder="Ingrese una descripción"
          />
        </div>
      </b-collapse>
      <div v-if="selectedCard.params.length > 0">
        <div
          v-b-toggle="'features-collapse-5'"
          class="font-normal-3 mb-2 default-card-category"
          v-on:click="onToggleClick('features-collapse-5')"
        >
          <div
            class="default-cards-arrow"
            v-show="collapseStates['features-collapse-5']"
          >
            &#9660;
          </div>
          <div
            class="default-cards-arrow"
            v-show="!collapseStates['features-collapse-5']"
          >
            &#9658;
          </div>
          <div class="default-cards-category">
            Descripción de los parámetros
          </div>
        </div>
        <b-collapse
          v-bind:id="'features-collapse-5'"
          :ref="'features-collapse-5'"
        >
          <!-- Lista de descripción de parámetros -->
          <div>
            <div v-for="(param, i) in selectedCard.params" :key="param.id">
              <div class="font-small-2 card-feature-symbol-counter-2">
                {{ parseInt(i + 1) }}.
              </div>
              <div
                class="card-feature-symbol-2"
                v-katex:display="{
                  expression: param.symbol.trim() || '\\textcolor{red}{?}',
                  options: { throwOnError: false, errorColor: 'red' }
                }"
              ></div>
              <b-form-textarea
                class="input-area-1 font-normal-1 card-feature-text-area-2 mt-2 mb-2"
                type="text"
                v-model="param.description"
                placeholder="Ingrese una descripción"
              />
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
    <confirmation
      ref="confirmationDeleteCanvasCard"
      v-bind:showConfirmation="showDeleteCanvasCardConfirmation"
      v-bind:title="'Borrar ficha del lienzo'"
      v-bind:content="
        '¿Estás seguro de que deseas borrar esta ficha del lienzo?'
      "
      v-bind:accept="'Si'"
      v-bind:cancel="'No'"
      v-on:onAccept="deleteCard"
    ></confirmation>
    <confirmation
      ref="confirmationUpdateCard"
      v-bind:showConfirmation="showUpdateCardConfirmation"
      v-bind:title="'Actualizar ficha de usuario'"
      v-bind:content="
        '¿Estás seguro de que deseas actualizar esta ficha en tu cuenta?. El estado anterior se perderá.'
      "
      v-bind:accept="'Si'"
      v-bind:cancel="'No'"
      v-on:onAccept="updateCard"
    ></confirmation>
  </div>
</template>

<script>
/**
 * Componente para el formulario de caracteristicas de la ficha seleccionada.
 * <pre>
 * - Muestra el titulo, la descripción y el simbolo y la descripción de la ficha seleccionada.
 * - Si no hay ninguna ficha seleccionada no se muestra el fromulario.
 * - Implementa botones para cada funcionalidad de la ficha.
 * </pre>
 *
 * @module interface-components-mathpad-card-features
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";
import Solve from "vue-material-design-icons/PlayCircleOutline";
import Eval from "vue-material-design-icons/CheckboxMarkedCircleOutline";
import Simplify from "vue-material-design-icons/EyeCircleOutline";
import Factorize from "vue-material-design-icons/AlphaFCircleOutline";
import Expand from "vue-material-design-icons/SwapHorizontalCircleOutline";
import Fractionate from "vue-material-design-icons/SwapVerticalCircleOutline";
import Edit from "vue-material-design-icons/CircleEditOutline";
import Save from "vue-material-design-icons/ContentSaveMoveOutline";
import Update from "vue-material-design-icons/ContentSaveEditOutline";
import Delete from "vue-material-design-icons/DeleteCircleOutline";

// Modulos creados
import saveCardAgent from "../../../service_agents/saveCardAgent";
import solveCardAgent from "../../../service_agents/solveCardAgent";
import canvasController from "../../../controllers/canvasController";
import setCardRateAgent from "../../../service_agents/setCardRateAgent";
import updateCard from "../../../service_agents/updateCardAgent";
import updateCardAgent from "../../../service_agents/updateCardAgent";
import cardController from "../../../controllers/cardController";
import defaultCardsController from "../../../controllers/defaultCardsController";
import confirmation from "../confirmation";

/**
 * @vue-computed {json} selectedCard - Ficha matemática seleccionada en el lienzo.
 */
export default {
  name: "cardFeatures",
  computed: {
    selectedCard() {
      return this.$store.state.mathpad.selectedCard;
    },
    logged() {
      return this.$store.state.user.logged;
    }
  },
  components: {
    Solve,
    Eval,
    Simplify,
    Factorize,
    Expand,
    Fractionate,
    Edit,
    Save,
    Update,
    Delete,
    confirmation
  },
  data() {
    return {
      rating: 0,
      collapseStates: {
        "features-collapse-1": true,
        "features-collapse-2": true,
        "features-collapse-3": true,
        "features-collapse-4": false,
        "features-collapse-5": false,
        "features-collapse-6": false
      },
      showDeleteCanvasCardConfirmation: {
        show: false
      },
      showUpdateCardConfirmation: {
        show: false
      }
    };
  },
  methods: {
    /**
     * Resolver ficha seleccionada y añadir el resultado en el lienzo.
     */
    solveCard(type) {
      // Obtener ficha selecionada
      var originalCard = this.selectedCard;
      var card = this.selectedCard;

      // Mostrar cargando
      originalCard.loading = true;

      // Asignar tipo de solucionador
      switch (type) {
        case "eval":
          card = defaultCardsController.coverCard(card, 1000);
          break;
        case "simplify":
          card = defaultCardsController.coverCard(card, 1001);
          break;
        case "factorize":
          card = defaultCardsController.coverCard(card, 1002);
          break;
        case "expand":
          card = defaultCardsController.coverCard(card, 1003);
          break;
        case "fractionate":
          card = defaultCardsController.coverCard(card, 1004);
          break;
      }

      // Resolvar
      solveCardAgent(card, (status, data) => {
        // Si la ficha se resolvió correctamente
        if (status === 200) {
          // Asignar escala
          data.bounds = {
            x: 0,
            y: 0,
            scale: originalCard.bounds.scale
          };

          // Asignar que es una ficha resuelta
          data.solvedOf = originalCard;

          // Añadir el resultado en el lienzo.
          data = canvasController.addCard(data);

          // Asignar esta ficha resultado como ficha seleccionada
          this.$store.commit("setMathpadSelectedCard", {
            selectedCard: data
          });
        } else {
          // Notificar error
          this.$store.commit("setNotification", {
            text: data,
            type: "danger",
            duration: 5
          });
        }

        // Ocultar cargando
        originalCard.loading = false;
      });
    },
    /**
     * Editar ficha seleccionada en el entorno de programación.
     */
    editCard() {
      this.$store.state.mathpad.programingCard = this.$store.state.mathpad.selectedCard;
      this.$store.commit("setMathpadProgramCard");
    },
    /**
     * Guardar ficha seleccionada en la base de datos.
     */
    saveCard() {
      const self = this;

      // Obtener ficha selecionada
      var originalCard = this.selectedCard;

      // Mostrar cargando
      originalCard.loading = true;

      // Resolvar
      firebase
        .auth()
        .currentUser.getIdToken(false)
        .then(function(ID_TOKEN) {
          saveCardAgent(
            ID_TOKEN,
            self.$store.state.user.email,
            self.selectedCard,
            (status, data) => {
              // Si la ficha se guardó correctamente
              if (status === 201) {
                // Notificar guardado
                self.$store.commit("setNotification", {
                  text: "La ficha se guardó correctamente.",
                  type: "success",
                  duration: 5
                });
              } else if (status === 401) {
                // Notificar guardado
                self.$store.commit("setNotification", {
                  text: data,
                  type: "warning",
                  duration: 5
                });
              } else if (status === 404) {
                // Notificar guardado
                self.$store.commit("setNotification", {
                  text: data,
                  type: "warning",
                  duration: 5
                });
              } else {
                // Notificar error
                self.$store.commit("setNotification", {
                  text: data,
                  type: "danger",
                  duration: 5
                });
              }

              // Ocultar cargando
              originalCard.loading = false;
            }
          );
        });
    },
    /**
     * Borrar ficha seleccionada del lienzo.
     */
    deleteCard() {
      // Remover ficha del lienzo
      canvasController.removeCard(this.selectedCard);
      // Quitar ficha seleccionada
      this.$store.commit("setMathpadSelectedCard", { selectedCard: null });
    },
    cardRating(rating) {
      this.rating = rating;
      this.setCardRating();
    },
    setCardRating() {
      const self = this;

      // Obtener ficha selecionada
      var originalCard = this.selectedCard;

      // Mostrar cargando
      originalCard.loading = true;

      firebase
        .auth()
        .currentUser.getIdToken(false)
        .then(function(ID_TOKEN) {
          setCardRateAgent(
            ID_TOKEN,
            self.$store.state.user.email,
            self.selectedCard.ID_CARD,
            self.rating,
            (status, data) => {
              if (status === 200) {
                // Notificar calificación exitosa
                self.$store.commit("setNotification", {
                  text: "La ficha se calificó correctamente.",
                  type: "success",
                  duration: 5
                });
              } else if (status === 201) {
                // Notificar calificación exitosa
                self.$store.commit("setNotification", {
                  text: "La ficha se calificó correctamente.",
                  type: "success",
                  duration: 5
                });
              } else {
                self.$store.commit("setNotification", {
                  text: data,
                  type: "danger",
                  duration: 5
                });
              }

              // Ocultar cargando
              originalCard.loading = false;
            }
          );
        });
    },
    updateCard() {
      const self = this;

      // Obtener ficha selecionada
      var originalCard = this.selectedCard;

      // Mostrar cargando
      originalCard.loading = true;

      firebase
        .auth()
        .currentUser.getIdToken(false)
        .then(function(ID_TOKEN) {
          updateCardAgent(
            ID_TOKEN,
            self.$store.state.user.email,
            self.selectedCard,
            (status, data) => {
              if (status === 200) {
                // Notificar calificación exitosa
                self.$store.commit("setNotification", {
                  text: "La ficha se actualizó correctamente.",
                  type: "success",
                  duration: 5
                });
              } else if (status === 401) {
                self.$store.commit("setNotification", {
                  text: data,
                  type: "warning",
                  duration: 5
                });
              } else if (status === 404) {
                self.$store.commit("setNotification", {
                  text: data,
                  type: "warning",
                  duration: 5
                });
              } else {
                // Notificar error en calificación
                self.$store.commit("setNotification", {
                  text: data,
                  type: "danger",
                  duration: 5
                });
              }

              // Ocultar cargando
              originalCard.loading = false;
            }
          );
        });
    },

    onToggleClick(collapseRef) {
      if (!this.collapseStates[collapseRef]) {
        this.collapseStates[collapseRef] = true;
      } else {
        this.collapseStates[collapseRef] = false;
      }
      this.$refs[collapseRef].show = this.collapseStates[collapseRef];
    },

    onKeyUp() {
      var result = cardController.checkIncorrectLaTeXSymbols(this.selectedCard);
      if (result) {
        this.$store.commit("setNotification", {
          text: result,
          type: "warning",
          duration: 5
        });
      }
    },

    deleteCardConfirmation() {
      this.showDeleteCanvasCardConfirmation.show = true;
    },

    updateCardConfirmation() {
      this.showUpdateCardConfirmation.show = true;
    }
  }
};
</script>
<style>
.card-feature-title {
  color: var(--text-color-2);
  margin-top: 7px;
  margin-bottom: 5px;
  margin-right: 20px;
  margin-left: 20px;
  width: 100%;
}
.card-feature-symbol-counter {
  position: relative;
  color: var(--text-color-2);
  margin-left: 22px;
  margin-bottom: -25px;
}
.card-feature-symbol {
  color: var(--text-color-1);
  text-align: center;
  background-color: var(--background-color-5);
  border-radius: 5px;
  width: 80px;
  margin-left: 20px;
  margin-top: 10px;
  overflow: auto;
}
.card-feature-symbol-counter-2 {
  position: relative;
  width: 100%;
  color: var(--text-color-2);
  margin-left: 22px;
  margin-bottom: -25px;
}
.card-feature-symbol-2 {
  color: var(--text-color-1);
  text-align: center;
  background-color: var(--background-color-5);
  border-radius: 5px;
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-top: 10px;
  overflow: auto;
}
.card-feature-input {
  width: 80px;
  margin-left: 20px;
}

.card-feature-text-area {
  color: var(--text-color-2);
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-bottom: 7px;
}

.card-feature-input-2 {
  width: calc(100% - 40px);
  margin-left: 20px;
}

.card-feature-text-area-2 {
  color: var(--text-color-2);
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-bottom: 7px;
}

.card-feature-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.card-feature-button {
  color: var(--text-color-2) !important;
  width: 100px;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 10px;
}

.card-rating-container {
  margin-top: 7px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.card-feature-li {
  margin-left: -20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.default-card-category {
  color: var(--text-color-2);
  position: relative;
  width: 100%;
  height: 21px;
  padding-left: 24px;
  margin-top: 12px;
}

.default-card-category[aria-expanded="true"] {
  background-color: var(--background-color-10);
}
</style>
