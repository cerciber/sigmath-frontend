<template>
  <!-- signup -->
  <div class="signup">
    <div
      class="signup-content"
      v-bind:style="{
        backgroundImage: 'url(' + ilustrations.backgroundPattern + ')',
        backgroundRepeat: 'repeat',
        backgroundSize: '500px'
      }"
    >
      <div class="signup-components">
        <div class="signup-form">
          <div class="signup-logo">
            <div class="signup-logo-content">
              <img :src="ilustrations.signupLogo" />
            </div>
          </div>
          <div class="signup-title">Registrate ahora</div>
          <div class="signup-email">
            <div class="signup-email-title">Nombre de usuario</div>
            <b-input
              class="signup-email-input"
              placeholder="Usuario123"
              v-model="inputs.nickname"
              @keydown.native="loginUserInputEnter"
            ></b-input>
          </div>
          <div class="signup-email">
            <div class="signup-email-title">Correo electrónico</div>
            <b-input
              class="signup-email-input"
              ref="signup-email-input"
              placeholder="usuario@gmail.com"
              v-model="inputs.email"
              @keydown.native="loginEmailInputEnter"
            ></b-input>
          </div>
          <div class="signup-password">
            <div class="signup-password-title">Contraseña</div>
            <b-input
              class="signup-password-input"
              ref="signup-password-input"
              type="password"
              placeholder="______"
              v-model="inputs.password"
              @keydown.native="loginPasswordInputEnter"
            ></b-input>
          </div>
          <div class="signup-password">
            <div class="signup-password-title">Valida la contraseña</div>
            <b-input
              class="signup-password-input"
              ref="signup-password-verify-input"
              type="password"
              placeholder="______"
              v-model="inputs.password_confirmation"
              @keydown.native="loginPasswordVerifyInputEnter"
            ></b-input>
          </div>
          <!-- NO BORRRAR!!!!
          <div class="signup-conditions-text">
            Al registrarte aceptas Condiciones de servicios y la
            <br />Política de privacidad de Sigmath
          </div>-->
          <div class="signup-button-container">
            <b-button class="signup-button" v-on:click="signup"
              >Registrarse</b-button
            >
            <!-- Cargando -->
            <div v-if="loading" class="signup-loading-container">
              <img class="signup-loading" :src="ilustrations.loading" />
            </div>
          </div>
          <!-- NO BORRRAR!!!!
          <div class="signup-oauth-message">O puedes registrarte con</div>
          <div class="signup-oauth-icons">
            <div class="signup-oauth-google">
              <img
                class="signup-oauth-google-icon"
                :src="ilustrations.signupGoogle"
              />
            </div>
            <div class="signup-oauth-facebook">
              <img
                class="signup-oauth-facebook-icon"
                :src="ilustrations.signupFacebook"
              />
            </div>
          </div>-->
          <div class="signup-signup-text">
            ¿Ya tienes una cuenta? &nbsp;
            <router-link class="signup-signup-link" to="/login"
              >Inicia sesión</router-link
            >
          </div>
        </div>
        <div class="signup-ilustation" v-if="!$store.state.movil">
          <div class="signup-ilustation-content">
            <img :src="ilustrations.signupIlustation" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Panatalla de inicio de sesión del sistema.
 *
 * @module  interface-view-signup
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";

// Modulos creados
import signupAgent from "../../service_agents/signupAgent";
import encryptionController from "../../controllers/encryptionController";

/**
 * @vue-data {json} ilustations - Direcciones de las ilustraciones de la vista.
 * @vue-data {string} ilustations.backgroundPattern - Dirección del patrón de fondo.
 * @vue-data {string} ilustations.signupIlustation - Dirección de la ilustración principal del signup.
 * @vue-data {string} ilustations.signupLogo - Dirección del logo de Sigmath.
 * @vue-data {string} ilustations.loginFacebook - Dirección del logo de Facebook.
 * @vue-data {string} ilustations.loginGoogle - Dirección del logo de Google.
 * @vue-data {json} inputs - Valores del formulario.
 * @vue-data {string} inputs.nickname - Apodo del usuario.
 * @vue-data {string} inputs.email - Correo del usuario.
 * @vue-data {string} inputs.password - Contraseña del usuario.
 * @vue-data {string} inputs.password_confirmation - Confirmación de la contraseña del usuario.
 */
export default {
  name: "signup",
  data() {
    return {
      ilustrations: {
        backgroundPattern: `./../../../public/svg/patron_fondo_login.svg`,
        signupIlustation: `./../../../public/svg/ilustracion_sign_up.svg`,
        signupLogo: `./../../../public/svg/logo_sigmath-03.svg`,
        signupFacebook: `./../../../public/svg/facebook.svg`,
        signupGoogle: `./../../../public/svg/google-hangouts.svg`,
        loading: `./../../../public/svg/loading.gif`
      },
      inputs: {
        nickname: "",
        email: "",
        password: "",
        password_confirmation: ""
      },
      loading: false
    };
  },
  methods: {
    /**
     * Registrar al usuario en el sistema
     */
    signup() {
      // Verificar si hay algun campo vacio
      if (this.inputs.nickname.trim() === "") {
        this.$store.commit("setNotification", {
          text: "El nombre de usuario no puede estar vacío.",
          type: "warning",
          duration: 5
        });
        return;
      } else if (this.inputs.email.trim() === "") {
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
      } else if (this.inputs.password_confirmation.trim() === "") {
        this.$store.commit("setNotification", {
          text: "La confirmación de la contraseña no puede estar vacía.",
          type: "warning",
          duration: 5
        });
        return;
      }

      // Verificar si la contraseña no coincide
      else if (this.inputs.password != this.inputs.password_confirmation) {
        this.$store.commit("setNotification", {
          text: "Las contraseñas no coinciden.",
          type: "warning",
          duration: 5
        });
        return;
      }

      this.loading = true;
      // Encriptar contraseña
      encryptionController.encryptPassword(this.inputs.password, hash => {
        // Registrar usuario en firebase para la autenticación
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.inputs.email,
            this.inputs.password
          )
          .then(data => {
            data.user
              .updateProfile({
                displayName: this.inputs.nickname
              })
              .then(() => {
                // Registrar usuario en la base de datos
                signupAgent(
                  {
                    nickname: this.inputs.nickname,
                    email: this.inputs.email,
                    password: hash
                  },
                  (state, data) => {
                    // Si se obtuvieron resultados
                    if (state === 201) {
                      this.$store.commit("setNotification", {
                        text: "El usuario se registró correctamente",
                        type: "success",
                        duration: 5
                      });

                      // Registar que el usuario está logeado
                      this.$store.commit("setUserIsLogged", {
                        logged: true
                      });

                      // Registrar datos del usuario
                      this.$store.commit("setUserData", {
                        nickname: this.inputs.nickname,
                        email: this.inputs.email
                      });

                      // Ir al mathpad
                      this.$router.push("mathpad");
                    }

                    // Si el correo ya existe
                    else if (status === 409) {
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
              });
          })
          .catch(err => {
            if (err.code === "auth/invalid-email") {
              this.$store.commit("setNotification", {
                text: "El correo electrónico no es válido.",
                type: "warning",
                duration: 5
              });
            } else if (err.code === "auth/weak-password") {
              this.$store.commit("setNotification", {
                text: "La contraseña debe tener mínimo 6 caracteres.",
                type: "warning",
                duration: 5
              });
            } else {
              this.$store.commit("setNotification", {
                text: "El usuario no se pudo registrar",
                type: "danger",
                duration: 5
              });
            }
            this.loading = false;
          });
      });
    },
    loginUserInputEnter(event) {
      if (event.which === 13) {
        this.$refs["signup-email-input"].$el.focus();
      }
    },
    loginEmailInputEnter(event) {
      if (event.which === 13) {
        this.$refs["signup-password-input"].$el.focus();
      }
    },
    loginPasswordInputEnter(event) {
      if (event.which === 13) {
        this.$refs["signup-password-verify-input"].$el.focus();
      }
    },
    loginPasswordVerifyInputEnter(event) {
      if (event.which === 13) {
        this.signup();
      }
    }
  }
};
</script>

<style>
.signup {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #032479 0%, #02174c 100%);
  box-shadow: 0px 3px 30px 5px rgba(22, 13, 13, 0.25);
}
.signup-content {
  width: 100%;
  height: 100%;
}
.signup-components {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.signup-ilustation-content {
  width: 600px;
  height: 600px;
}
.signup-ilustation {
  width: 600px;
  height: 600px;
}
.signup-form {
  width: 385px;
  height: 600px;
  margin-right: 60px;
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
  .signup-form {
    width: 100%;
    height: 100%;
    border-radius: 0px;
    margin-right: 0px;
  }
}

.signup-logo {
  width: 130px;
  height: 130px;
}
.signup-logo {
  width: 130px;
  height: 130px;
}
.signup-title {
  width: 100%;
  font-family: "Signika Negative";
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 30px;
  color: #02174d;
}
.signup-email {
  width: calc(100% - 100px);
}
.signup-email-title {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #02174d;
  text-align: left;
}
.signup-email-input {
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
.signup-email-input::placeholder {
  color: #b9b9b9;
}
.signup-email-input:focus {
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.signup-password {
  width: calc(100% - 100px);
}
.signup-password-title {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #02174d;
  text-align: left;
}
.signup-password-input {
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
.signup-password-input::placeholder {
  color: #b9b9b9;
}
.signup-password-input:focus {
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.signup-button-container {
  width: calc(100% - 100px);
  height: 35px;
  margin-top: 15px;
  margin-bottom: 30px;
}
.signup-button {
  width: calc(100%);
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
.signup-button:focus {
  background: #f07513 !important;
}
.signup-button:active {
  background: #c55e0c !important;
}
.signup-button:hover {
  background: #f39244 !important;
}
.signup-oauth-message {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #02174d;
  width: 100%;
}
.signup-recover-link {
  width: 100%;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  text-decoration-line: underline;
  color: #0239c2;
}
.signup-oauth-icons {
  display: flex;
}
.signup-oauth-google {
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
.signup-oauth-google-icon {
  width: 29.99px;
  height: 29.99px;
}
.signup-oauth-facebook {
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
.signup-oauth-facebook-icon {
  width: 29.99px;
  height: 29.99px;
}
.signup-signup-text {
  width: 100%;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #02174d;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.signup-signup-link {
  color: #f07513;
}
.signup-conditions-text {
  width: 100%;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #02174d;
  display: flex;
  justify-content: center;
}
.signup-conditions-link {
  color: #f07513;
}
.signup-loading {
  position: absolute;
  width: 40px;
  z-index: 2;
  left: calc(50% - 20px);
  top: 2px;
  pointer-events: none;
}
.signup-loading-container {
  z-index: 2;
  position: relative;
  pointer-events: none;
}
</style>
