<template>
  <div>
    <!-- Barra de herramientas -->
    <b-navbar-nav>
      <b-nav-item class="navbar-item nav-icons" @click="goToMathpad">
        <Undo class="navbar-icon" />
        <div class="navbar-text">Regresar al lienzo</div>
      </b-nav-item>
      <b-nav-item class="navbar-item nav-icons">
        <!--<b-nav-item class="navbar-item">
          <FilterIcon class="navbar-icon" />
          <div class="navbar-text">
            <b-nav-item-dropdown
              text="Filtrar"
              class="navbar-dropdown-text"
              split
            >
              <div class="navbar-dropdown-items">
                <div class="navbar-dropdown-items-content">
                  <b-dropdown-item>
                    <div class="navbar-dropdown-item">
                      <div
                        class="navbar-dropdown-item-text"
                        v-b-modal.fastCardModal
                      >
                        Titulo de la ficha (A - Z)
                      </div>
                    </div>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <div class="navbar-dropdown-item">
                      <div class="navbar-dropdown-item-text">Calificación</div>
                    </div>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <div class="navbar-dropdown-item">
                      <div class="navbar-dropdown-item-text">Fecha</div>
                    </div>
                  </b-dropdown-item>
                  <div class="navbar-dropdown-line" />
                  <b-dropdown-text>
                    <div class="navbar-dropdown-item">
                      <div class="navbar-dropdown-item-text">Alcance</div>
                    </div>
                  </b-dropdown-text>
                  <b-dropdown-item>
                    <div class="navbar-dropdown-item sub">
                      <div class="navbar-dropdown-item-text">Público</div>
                    </div> </b-dropdown-item
                  ><b-dropdown-item>
                    <div class="navbar-dropdown-item sub">
                      <div class="navbar-dropdown-item-text">Privado</div>
                    </div>
                  </b-dropdown-item>
                </div>
              </div>
            </b-nav-item-dropdown>
          </div>
        </b-nav-item>-->
      </b-nav-item>
      <!--<b-form-input
        class="card-feature-input-1"
        type="text"
        placeholder="Buscar ficha"
      />
      <b-nav-item class="navbar-item nav-icons">
        <Search class="navbar-icon" />
      </b-nav-item>-->
    </b-navbar-nav>
  </div>
</template>

<script>
/**
 * Ingrese la descripción del modulo
 *
 * @module userCardOptionsVue
 * @author Labeleon <labeleon@gmail.com>
 */

// Contendio JS
import Undo from "vue-material-design-icons/Undo.vue";
import FilterIcon from "vue-material-design-icons/Filter.vue";
import Search from "vue-material-design-icons/Magnify.vue";

export default {
  name: "userCardOptions",
  data() {
    return {
      value: "Hola desde Vue.js"
    };
  },
  components: {
    Undo,
    FilterIcon,
    Search
  },
  methods: {
    goToMathpad() {
      this.$router.push("/mathpad");
    }
  }
};
</script>

<style lang="scss">
.nav-icons {
  color: #f07513;
}

.row {
  display: flex;
  flex-direction: row;
  margin-left: 0px;
  margin-right: 0px;
}
.col {
  display: flex;
  flex-direction: column;
  padding: 0px;
}
.card-feature-input-1 {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 5px;

  width: calc(30% - 40px);
  height: 35px;
  margin: 20px;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: #b9b9b9;
}
.card-feature-input-1:focus {
  background-color: transparent;
  color: #b9b9b9;
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.navbar-dropdown-item-text {
  position: relative;
  left: -4px;
  color: #ffffff !important;
}
.sub {
  margin-left: -5px;
}

@media only screen and (max-width: 1000px) {
  .cards-title {
    width: 40vw;
  }
}
</style>
