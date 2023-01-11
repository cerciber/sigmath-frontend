<template>
  <div id="userCardFooter">
    <hr />
    <div>
      <div class="card-footer-info">
        <div>
          <div class="section">
            <div class="font-1">Alcance:</div>
            <div class="section" v-if="card.CardInfo.scope == 'public'">
              <b-link @click="toggleScope"
                ><div class="font-3">Público</div></b-link
              >
              <b-link @click="toggleScope"
                ><div class="font-2">Privado</div></b-link
              >
            </div>
            <div class="section" v-if="card.CardInfo.scope == 'private'">
              <b-link @click="toggleScope"
                ><div class="font-2">Público</div></b-link
              >
              <b-link @click="toggleScope"
                ><div class="font-3">Privado</div></b-link
              >
            </div>
          </div>
        </div>
        <div>
          <div class="section">
            <div class="font-1">Creado:</div>
            <div class="font-2">
              {{
                card.CardInfo.creationDate.substring(0, 10) +
                  " (" +
                  card.CardInfo.creationDate.substring(11, 19) +
                  ")"
              }}
            </div>
          </div>
        </div>
        <div>
          <div class="section">
            <div class="font-1">Modificado:</div>
            <div class="font-2">
              {{
                card.CardInfo.modificationDate.substring(0, 10) +
                  " (" +
                  card.CardInfo.modificationDate.substring(11, 19) +
                  ")"
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="section-center stars">
        <star-rating
          class="card-rating"
          :increment="0.1"
          :star-size="25"
          :read-only="true"
          :show-rating="false"
          v-model="card.CardInfo.rateAvg"
        ></star-rating>
      </div>
      <div class="section-center">
        <b-button class="card-button" @click="addCard"
          ><PlusCircleOutlineIcon></PlusCircleOutlineIcon>
          <div class="button-text">Usar</div></b-button
        >
        <b-button class="card-button" @click="deleteCardConfirmation"
          ><MinusCircleOutline></MinusCircleOutline>
          <div class="button-text">Eliminar</div>
        </b-button>
      </div>
    </div>
    <confirmation
      ref="confirmationDeleteCard"
      v-bind:showConfirmation="showDeleteCardConfirmation"
      v-bind:title="'Eliminar ficha de usuario'"
      v-bind:content="
        '¿Estás seguro de que deseas eliminar esta ficha en tu cuenta?. Ya no podrás recuperarla.'
      "
      v-bind:accept="'Si'"
      v-bind:cancel="'No'"
      v-on:onAccept="deleteCard"
    ></confirmation>
  </div>
</template>

<script>
/**
 * Footer de las tarjetas del buscador de Mis fichas
 *
 * @module userCardFooterVue
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";

// Modulos creados
import updateCardInfoAgent from "../../../service_agents/updateCardInfoAgent";

// Contendio JS
import StarIcon from "vue-material-design-icons/Star";
import PlusCircleOutlineIcon from "vue-material-design-icons/PlusCircleOutline";
import MinusCircleOutline from "vue-material-design-icons/MinusCircleOutline";
import canvasController from "../../../controllers/canvasController";
import deleteUserCardAgent from "../../../service_agents/deleteCardAgent";
import confirmation from "../confirmation";

export default {
  name: "userCardFooter",
  components: {
    StarIcon,
    PlusCircleOutlineIcon,
    MinusCircleOutline,
    confirmation
  },
  props: {
    card: Object
  },
  data() {
    return {
      points: 3,
      scope: "public",
      showDeleteCardConfirmation: {
        show: false
      }
    };
  },
  methods: {
    addCard() {
      var card = canvasController.addCard(this.card);
      card.solvedOf = this.$store.state.mathpad.selectedCard;
      this.$store.commit("setMathpadSelectedCard", { selectedCard: card });
      this.$store.commit("setNotification", {
        text: "La ficha se añadió al lienzo",
        type: "info",
        duration: 5
      });
    },
    deleteCard() {
      const self = this;
      firebase
        .auth()
        .currentUser.getIdToken(false)
        .then(function(ID_TOKEN) {
          deleteUserCardAgent(
            ID_TOKEN,
            self.$store.state.user.email,
            self.card.ID_CARD,
            (status, data) => {
              // Si la ficha se guardó correctamente
              if (status === 200) {
                // Notificar guardado
                self.$store.commit("setNotification", {
                  text: "La ficha se eliminó correctamente.",
                  type: "success",
                  duration: 5
                });

                // Borrar en la vista de mis fichas
                self.$store.state.user.cards.forEach((element, index, arr) => {
                  if (
                    self.$store.state.user.cards[index].ID_CARD ==
                    self.card.ID_CARD
                  ) {
                    self.$store.state.user.cards.splice(index, 1);
                  }
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
                // Notificar error
                self.$store.commit("setNotification", {
                  text: data,
                  type: "danger",
                  duration: 5
                });
              }
            }
          );
        });
    },
    toggleScope() {
      if (this.card.CardInfo.scope == "public") {
        this.card.CardInfo.scope = "private";
      } else if (this.card.CardInfo.scope == "private") {
        this.card.CardInfo.scope = "public";
      }
      const self = this;
      firebase
        .auth()
        .currentUser.getIdToken(false)
        .then(function(ID_TOKEN) {
          updateCardInfoAgent(
            ID_TOKEN,
            self.$store.state.user.email,
            { ID_CARD: self.card.ID_CARD, scope: self.card.CardInfo.scope },
            (status, data) => {
              if (status === 200) {
                // Notificar calificación exitosa
                if (self.card.CardInfo.scope === "public") {
                  self.$store.commit("setNotification", {
                    text: "Ahora todos los usuarios pueden buscar esta ficha.",
                    type: "success",
                    duration: 5
                  });
                } else {
                  self.$store.commit("setNotification", {
                    text: "Ahora solo tu puedes acceder a esta ficha.",
                    type: "success",
                    duration: 5
                  });
                }
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
            }
          );
        });
    },

    deleteCardConfirmation() {
      this.showDeleteCardConfirmation.show = true;
    }
  }
};
</script>

<style lang="scss" scope>
.row {
  display: flex;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 5px;
}
.last-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
.right {
  margin: 0px 10px 0 20px !important;
}
hr {
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: 2px;
  margin-bottom: 2px;
}
#divider {
  color: rgba(255, 255, 255, 0.15);
}
.col {
  display: flex;
  flex-direction: column;
  padding: 0px;
}
.font-1 {
  /* Ayuda-SemiBold-SigMath */
  font-family: Titillium Web;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #ffffff;

  margin: 0px 4px 0 10px;
}
.font-2 {
  /* Pequeño-SigMath */

  font-family: Titillium Web;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height */
  margin: 2px 0 0 0px;
  color: #ffffff;

  color: #ffffff;
  margin: 2px 0 0 6px;
}
.font-3 {
  /* Pequeño-SigMath */

  font-family: Titillium Web;
  font-style: normal;
  font-weight: 1000;
  font-size: 14px;
  line-height: 15px;
  /* identical to box height */

  margin: 2px 0 0 6px;
  color: #ffa70d;
}

.card-button {
  width: 40%;
  border-radius: 5px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff;
  margin: 10px;
  margin-bottom: 0px;
  margin-top: 10px;
  padding: 1px 12px 1px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #ffffff !important;
  box-sizing: border-box;
  font-family: "Titillium Web";
  font-style: normal;
  box-shadow: none !important;
}
.button-text {
  margin-left: 10px;
}
#userCardFooter {
  padding-bottom: 10px;
}
.stars {
  color: rgba(255, 255, 255, 0.5);
  margin: 10px;
}
.star-points {
  color: #ffa70d;
}
.section {
  display: flex;
  flex-wrap: wrap;
  align-items: left;
}
.section-center {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.card-footer-info {
  margin-top: 10px;
}
</style>
