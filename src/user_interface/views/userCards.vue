<template>
  <div id="userCards">
    <toolBar :parent="'userCards'"></toolBar>
    <div class="scrollable">
      <div class="row">
        <cardResult
          v-bind:card="card.Card"
          :parent="'userCards'"
          v-for="card in cards"
          :key="'cardResult' + card.Card.ID_CARD"
        ></cardResult>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Vista en la que se ven todas las fichas que ha creado el usuario
 *
 * @module userCardsVue
 * @author Labeleon <labeleon@gmail.com>
 */
// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";

// Contendio JS
import toolBar from "../components/toolBar";
import cardResult from "../components/mathpad/cardResult";
import selectUserCardsAgent from "../../service_agents/selectUserCardsAgent";

export default {
  name: "userCards",
  data() {
    return {
      cards: [],
    };
  },
  components: {
    toolBar,
    cardResult,
  },
  computed: {},
  methods: {
    selectUserCards() {
      const self = this;
      firebase
        .auth()
        .currentUser.getIdToken(false)
        .then(function (ID_TOKEN) {
          selectUserCardsAgent(
            ID_TOKEN,
            self.$store.state.user.email,
            (status, data) => {
              // Si la ficha se guardó correctamente
              if (status === 200) {
                // Notificar guardado
                self.$store.commit("setUserCards", { cards: data });
                self.cards = self.$store.state.user.cards;
              } else if (status === 401) {
                self.$store.commit("setNotification", {
                  text: data,
                  type: "warning",
                  duration: 5,
                });
              } else if (status === 404) {
                self.$store.commit("setNotification", {
                  text: data,
                  type: "info",
                  duration: 5,
                });
              } else {
                // Notificar error
                self.$store.commit("setNotification", {
                  text: data,
                  type: "danger",
                  duration: 5,
                });
              }
            }
          );
        });
    },
  },
  mounted() {
    this.selectUserCards();
  },
};
</script>

<style lang="scss">
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.scrollable {
  overflow: auto !important;
  height: 85vh;
}
</style>
