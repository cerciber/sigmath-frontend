<template>
  <!-- Login -->
  <div class="login">
    <div
      class="login-content"
      v-bind:style="{
        backgroundImage: 'url(' + ilustations.backgroundPattern + ')',
        backgroundRepeat: 'repeat',
        backgroundSize: '500px'
      }"
    >
      <div class="login-components">
        <div class="login-ilustation-content" v-if="!$store.state.movil">
          <div class="login-ilustation">
            <img :src="ilustations.loginIlustation" />
          </div>
        </div>
        <div class="login-form">
          <div class="login-logo">
            <div class="login-logo-content">
              <img :src="ilustations.loginLogo" />
            </div>
          </div>
          <div class="login-title">Inicia sesión</div>
          <div class="login-email">
            <div class="login-email-title">Correo electrónico</div>
            <b-input
              class="login-email-input"
              placeholder="usuario@gmail.com"
              v-model="inputs.email"
              @keydown.native="loginEmailInputEnter"
            ></b-input>
          </div>
          <div class="login-password">
            <div class="login-password-title">Contraseña</div>
            <b-input
              class="login-password-input"
              ref="login-password-input"
              type="password"
              placeholder="______"
              v-model="inputs.password"
              @keydown.native="loginPasswordInputEnter"
            ></b-input>
          </div>
          <div class="login-button-container">
            <b-button class="login-button" v-on:click="login"
              >Iniciar sesión</b-button
            >
            <!-- Cargando -->
            <div v-if="loading" class="login-loading-container">
              <img class="login-loading" :src="ilustations.loading" />
            </div>
          </div>
          <div class="login-signup-text">
            <router-link class="login-signup-link" to="/password"
              >Olvide mi contraseña</router-link
            >
            <div>Todavía no tienes una cuenta&nbsp;</div>
            <router-link class="login-signup-link" to="/signup"
              >Registrate aquí</router-link
            >
          </div>
          <!--
          <b-link class="login-recover-link">Olvidé mi contraseña</b-link>
          <div class="login-oauth-message">O puedes iniciar sesión con</div>
          <div class="login-oauth-icons">
            <div class="login-oauth-google">
              <img
                class="login-oauth-google-icon"
                :src="ilustations.loginGoogle"
              />
            </div>
            <div class="login-oauth-facebook">
              <img
                class="login-oauth-facebook-icon"
                :src="ilustations.loginFacebook"
              />
            </div>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Panatalla de inicio de sesión del sistema.
 *
 * @module  interface-view-login
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";

// Modulos creados
import loginAgent from "../../service_agents/loginAgent";
import encryptionController from "../../controllers/encryptionController";

/**
 * @vue-data {json} ilustations - Direcciones de las ilustraciones de la vista.
 * @vue-data {string} ilustations.backgroundPattern - Dirección del patrón de fondo.
 * @vue-data {string} ilustations.loginIlustation - Dirección de la ilustración principal del login.
 * @vue-data {string} ilustations.loginLogo - Dirección del logo de Sigmath.
 * @vue-data {string} ilustations.loginFacebook - Dirección del logo de Facebook.
 * @vue-data {string} ilustations.loginGoogle - Dirección del logo de Google.
 * @vue-data {json} inputs - Valores del formulario.
 * @vue-data {string} inputs.email - Correo del usuario.
 * @vue-data {string} inputs.password - Contraseña del usuario.
 */
export default {
  name: "login",
  data() {
    return {
      ilustations: {
        backgroundPattern: `./../../../public/svg/patron_fondo_login.svg`,
        loginIlustation: `./../../../public/svg/ilustracion_login.svg`,
        loginLogo: `./../../../public/svg/logo_sigmath-03.svg`,
        loginFacebook: `./../../../public/svg/facebook.svg`,
        loginGoogle: `./../../../public/svg/google-hangouts.svg`,
        loading: `./../../../public/svg/loading.gif`
      },
      inputs: {
        email: "",
        password: ""
      },
      loading: false
    };
  },
  methods: {
    /**
     * Autenticar al usuario en el sistema
     */
    login() {
      // Verificar si hay algun campo vacio
      if (this.inputs.email.trim() === "") {
        this.$store.commit("setNotification", {
          text: "El correo electrónico no puede estar vacío.",
          type: "warning",
          duration: 5
        });
        return;
      } else if (this.inputs.password.trim() === "") {
        this.$store.commit("setNotification", {
          text: "La contraseña no puede estar vacía.",
          type: "warning",
          duration: 5
        });
        return;
      }

      this.loading = true;
      // Autenticar usuario
      loginAgent(
        {
          email: this.inputs.email
        },
        (state, data) => {
          // Si se obtuvieron resultados
          if (state === 200) {
            // Comparar contraseñas
            this.loading = true;
            encryptionController.comparePasswords(
              this.inputs.password,
              data.password,
              result => {
                // Si coinciden
                if (result) {
                  // Autenticar al usuario con Firebase
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(
                      this.inputs.email,
                      this.inputs.password
                    )
                    .then(data => {
                      this.$store.commit("setNotification", {
                        text: "Te has autenticado correctamente.",
                        type: "success",
                        duration: 5
                      });

                      // Ir al mathpad
                      this.$router.push("mathpad");
                    })
                    .catch(err => {
                      this.$store.commit("setNotification", {
                        text:
                          "Lo sentimos, hubo un error al autenticar el usuario.",
                        type: "danger",
                        duration: 5
                      });
                    });
                }

                // Si no coinciden
                else {
                  this.$store.commit("setNotification", {
                    text: "El e-mail o la contraseña no son válidos.",
                    type: "warning",
                    duration: 5
                  });
                }

                this.loading = false;
              }
            );
          }

          // Si no se encontraron coincidencias
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
        }
      );
    },
    loginEmailInputEnter(event) {
      if (event.which === 13) {
        this.$refs["login-password-input"].$el.focus();
      }
    },
    loginPasswordInputEnter(event) {
      if (event.which === 13) {
        this.login();
      }
    }
  }
};
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #032479 0%, #02174c 100%);
  box-shadow: 0px 3px 30px 5px rgba(22, 13, 13, 0.25);
}
.login-content {
  width: 100%;
  height: 100%;
}
.login-components {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-ilustation-content {
  width: 700px;
  margin-right: 60px;
}
.login-ilustation {
  width: 700px;
  margin-right: 60px;
}
.login-form {
  width: 385px;
  height: 600px;
  background: #fefeff;
  box-shadow: 0px 3px 30px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: wrap;
  text-align: center;
}

@media only screen and (max-width: 768px) {
  .login-form {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
}

.login-logo-content {
  width: 130px;
  height: 130px;
}
.login-logo {
  width: 130px;
  height: 130px;
}
.login-title {
  width: 100%;
  font-family: "Signika Negative";
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 30px;
  color: #02174d;
  margin-top: -65px;
}
.login-email {
  width: calc(100% - 100px);
}
.login-email-title {
  margin-top: -30px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #02174d;
  text-align: left;
}
.login-email-input {
  width: 100%;
  height: 35px;
  border: 1px solid #0231a8;
  box-sizing: border-box;
  border-radius: 5px;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
}
.login-email-input::placeholder {
  color: #b9b9b9;
}
.login-email-input:focus {
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.login-password {
  width: calc(100% - 100px);
}
.login-password-title {
  margin-top: -45px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #02174d;
  text-align: left;
}
.login-password-input {
  width: 100%;
  height: 35px;
  border: 1px solid #0231a8;
  box-sizing: border-box;
  border-radius: 5px;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
}
.login-password-input::placeholder {
  color: #b9b9b9;
}
.login-password-input:focus {
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.login-button-container {
  width: calc(100% - 100px);
  height: 35px;
  margin-top: -35px;
  margin-bottom: 30px;
}
.login-button {
  width: calc(100%);
  height: 35px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  background: #f07513;
  border-radius: 10px;
  border: none;
  box-shadow: none !important;
}
.login-button:focus {
  background: #f07513 !important;
}
.login-button:active {
  background: #c55e0c !important;
}
.login-button:hover {
  background: #f39244 !important;
}
.login-oauth-message {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #02174d;
  width: 100%;
}
.login-recover-link {
  width: 100%;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  text-decoration-line: underline;
  color: #0239c2;
}
.login-oauth-icons {
  display: flex;
}
.login-oauth-google {
  width: 62.5px;
  height: 50px;
  background: #ffffff;
  border: 1px solid #0231a8;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}
.login-oauth-google-icon {
  width: 29.99px;
  height: 29.99px;
}
.login-oauth-facebook {
  width: 62.5px;
  height: 50px;
  background: #0231a8;
  border: 1px solid #0231a8;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-oauth-facebook-icon {
  width: 29.99px;
  height: 29.99px;
}
.login-signup-text {
  margin-bottom: -7px;
  width: 100%;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #02174d;
}
.login-signup-link {
  color: #f07513;
  width: 100%;
}
.login-loading {
  position: absolute;
  width: 40px;
  z-index: 2;
  left: calc(50% - 20px);
  top: 2px;
  pointer-events: none;
}
.login-loading-container {
  z-index: 2;
  position: relative;
  pointer-events: none;
}
</style>
