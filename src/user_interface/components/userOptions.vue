<template>
  <div v-if="logged">
    <b-navbar-nav>
      <b-nav-item class="navbar-item">
        <router-link to="/user-cards">
          <div>
            <MiCards class="navbar-icon" />
          </div>
          <div class="navbar-text">Mis fichas</div>
        </router-link>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <router-link to="/logout" @click.native="logout">
          <div>
            <Logout class="navbar-icon" />
          </div>
          <div class="navbar-text">Logout</div>
        </router-link>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <router-link to="/mathpad">
          <div>
            <MiAccount class="navbar-icon" />
          </div>
          <div class="navbar-text">{{ nickname }}</div>
        </router-link>
      </b-nav-item>
    </b-navbar-nav>
  </div>
  <div v-else>
    <b-navbar-nav>
      <b-nav-item class="navbar-item">
        <router-link to="/login">
          <div>
            <Login class="navbar-icon" />
          </div>
          <div class="navbar-text">Login</div>
        </router-link>
      </b-nav-item>
      <b-nav-item class="navbar-item">
        <router-link to="/signup">
          <div>
            <Signup class="navbar-icon" />
          </div>
          <div class="navbar-text">Signup</div>
        </router-link>
      </b-nav-item>
    </b-navbar-nav>
  </div>
</template>

<script>
/**
 * Menu de opciones del usuario (NO SE HA IMPLEMENTADO).
 *
 * @module interface-components-mathpad-user-options
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";
import MiCards from "vue-material-design-icons/Layers.vue";
import MiAccount from "vue-material-design-icons/Account.vue";
import Login from "vue-material-design-icons/AccountArrowLeft.vue";
import Logout from "vue-material-design-icons/AccountArrowRight.vue";
import Signup from "vue-material-design-icons/AccountPlus.vue";

/**
 *
 */
export default {
  name: "userOptions",
  components: {
    MiCards,
    MiAccount,
    Login,
    Logout,
    Signup
  },
  methods: {
    /**
     * Sacar usuario de la sesión.
     */
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Registar que el usuario no está logeado
          this.$store.commit("setUserIsLogged", {
            logged: false
          });

          // Borrar datos del usuario
          this.$store.commit("setUserData", {
            nickname: undefined,
            email: undefined
          });
        });
    }
  },
  computed: {
    logged() {
      return this.$store.state.user.logged;
    },
    nickname() {
      return this.$store.state.user.nickname;
    }
  }
};
</script>

<style>
.user-options-text {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #f07513 !important;
}
.user-options-nickname {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff !important;
}
</style>
