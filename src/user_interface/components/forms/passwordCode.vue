<template>
  <div class="form-password-code">
    <div class="form-logo">
      <img :src="ilustrations.signupLogo" />
    </div>
    <div class="form-title">Cambio de contraseña</div>
    <div class="form-text">Ingresa tu correo para reestablecer contraseña</div>
    <div class="form-input-type">
      <div class="form-input-title">Correo electrónico</div>
      <b-input
        class="form-input"
        placeholder="usuario@gmail.com"
        v-model="inputs.email"
      ></b-input>
    </div>
    <div class="form-buttons">
      <b-button class="password-button" v-on:click="sendCode"
        >Enviar codigo</b-button
      >
    </div>
    <div class="form-input-type">
      <div class="form-input-title">Código de verificación</div>
      <b-input
        class="form-input"
        placeholder="00000000"
        v-model="inputs.validationCode"
      ></b-input>
    </div>
  </div>
</template>

<script>
/**
 * Ingrese la descripción del modulo
 *
 * @module passwordCodeVue
 * @author Labeleon <labeleon@gmail.com>
 */

// Contendio JS
import sendEmailAgent from "../../../service_agents/sendEmailAgent";
import validationCodeController from "../../../controllers/validationCodeController";
export default {
  name: "name",
  data() {
    return {
      ilustrations: {
        signupLogo: "./../../../../public/svg/logo_sigmath-03.svg"
      },
      inputs: {
        validationCode: "",
        email: ""
      },
      validationCode: ""
    };
  },
  methods: {
    sendCode() {
      //Verificar que el correo del usario no sea vacio
      if (this.inputs.email.trim() === "") {
        this.$store.commit("setNotification", {
          text: "El email no puede ser vacío.",
          type: "warning",
          duration: 5
        });
      } else {
        this.validationCode = validationCodeController();
        sendEmailAgent(
          {
            email: this.inputs.email,
            code: this.validationCode
          },
          response => {
            if (response == 200) {
              this.$store.commit("setNotification", {
                text: "Se ha enviado el codigo de verificación a tu cuenta",
                type: "success",
                duration: 5
              });
            }
            if (response == 500) {
              this.$store.commit("setNotification", {
                text:
                  "No se ha enviado el codigo correctamente. Verifica que el correo exista y este escrito correctamente",
                type: "danger",
                duration: 5
              });
            }
          }
        );
      }
    },
    codeValidation() {
      //Verificar que el codigo no sea vacio
      if (this.inputs.validationCode.trim() === "") {
        this.$store.commit("setNotification", {
          text: "El codigó de verificación a no puede estar vacío.",
          type: "warning",
          duration: 5
        });
        return false;
      } else {
        //Verificación de existencia de codigo
        if (this.inputs.validationCode.trim() === this.validationCode) {
          return true;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.form-password-code {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: wrap;
  text-align: center;
  height: 70%;
}
</style>
