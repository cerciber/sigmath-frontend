<template>
  <div id="password">
    <div
      class="form-content"
      v-bind:style="{
        backgroundImage: 'url(' + ilustrations.backgroundPattern + ')',
        backgroundRepeat: 'repeat',
        backgroundSize: '500px'
      }"
    >
      <div class="col form-components">
        <div class="form-elements">
          <passwordCode
            ref="passwordCode"
            v-if="steps.passwordCodeShow"
          ></passwordCode>
          <passwordChange
            ref="passwordChange"
            v-if="steps.passwordChangeShow"
          ></passwordChange>
          <div class="form-buttons">
            <b-button
              v-if="steps.passwordCodeShow"
              class="password-button"
              v-on:click="codeValidation"
              >Siguiente paso</b-button
            >
            <b-button
              v-if="steps.passwordChangeShow"
              class="password-button"
              v-on:click="changePassword"
              >Continuar</b-button
            >
            <div class="form-text">
              ¿Ya tienes una cuenta?
              <router-link class="form-link" to="/login"
                >Inicia sesión</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Ingrese la descripción del modulo
 *
 * @module passwordVue
 * @author Labeleon <labeleon@gmail.com>
 */

// Contendio JS
import changePasswordAgent from "../../service_agents/changePasswordAgent";
import passwordCode from "../components/forms/passwordCode";
import passwordChange from "../components/forms/passwordChange";

export default {
  name: "name",
  components: {
    passwordCode,
    passwordChange
  },
  data() {
    return {
      steps: {
        passwordCodeShow: true,
        passwordChangeShow: false
      },
      ilustrations: {
        backgroundPattern: "./../../../../public/svg/patron_fondo_login.svg",
        signupLogo: "./../../../../public/svg/logo_sigmath-03.svg"
      },
      email: ""
    };
  },
  methods: {
    changeViewState() {
      this.steps.passwordChangeShow = true;
      this.steps.passwordCodeShow = false;
    },
    codeValidation() {
      if (this.$refs.passwordCode.codeValidation()) {
        this.email = this.$refs.passwordCode.inputs.email;
        this.changeViewState();
      } else {
        this.$store.commit("setNotification", {
          text: "El codigo de verificación es incorrecto",
          type: "danger",
          duration: 5
        });
      }
    },
    changePassword() {
      this.$refs.passwordChange.setEmail(this.email);
      this.$refs.passwordChange.changePassword();
    }
  }
};
</script>

<style lang="scss">
#password {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #032479 0%, #02174c 100%);
}
.form-content {
  width: 100%;
  height: 100%;
}
.form-components {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-elements {
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
  .form-elements {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
}

.form-logo {
  width: 130px;
}
.form-title {
  width: 100%;
  font-family: "Signika Negative";
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 30px;
  color: #02174d;
}
.form-text {
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
.form-link {
  color: #f07513;
}
.form-input-type {
  width: calc(100% - 100px);
}
.form-input-title {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #02174d;
  text-align: left;
}
.form-input {
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
.form-input:focus {
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.form-buttons {
  height: 20%;
  width: calc(100% - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: wrap;
}
.password-button {
  width: 100%;
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
.password-button:hover {
  background: #f07513;
}
.password-button:active {
  background: #f07513;
}
</style>
