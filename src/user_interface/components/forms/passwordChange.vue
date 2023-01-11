<template>
  <div class="form-password-change">
    <div class="form-logo">
      <img :src="ilustrations.signupLogo" />
    </div>
    <div class="form-title">Cambio de contraseña</div>
    <div class="form-text">Ingresa la nueva contraseña</div>
    <div class="form-input-type">
      <div class="form-input-title">Nueva contraseña</div>
      <b-input
        class="form-input"
        type="password"
        placeholder="______"
        v-model="inputs.newPassword"
      ></b-input>
    </div>
    <div class="form-input-type">
      <div class="form-input-title">Confirmar nueva contraseña</div>
      <b-input
        class="form-input"
        type="password"
        placeholder="______"
        v-model="inputs.newPassword2"
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

// Modulos importados
import firebase from "firebase/app";
import "firebase/auth";

// Modulos creados
import changePasswordAgent from "../../../service_agents/changePasswordAgent";

export default {
  name: "name",
  data() {
    return {
      ilustrations: {
        signupLogo: "./../../../../public/svg/logo_sigmath-03.svg",
      },
      inputs: {
        email: "",
        newPassword: "",
        newPassword2: "",
      },
    };
  },
  methods: {
    setEmail(email) {
      this.inputs.email = email;
    },
    changePassword() {
      //Validación de campos
      if (this.inputs.newPassword.trim() === "") {
        this.$store.commit("setNotification", {
          text: "La nueva contraseña no puede estar vacía.",
          type: "warning",
          duration: 5,
        });
      } else if (this.inputs.newPassword2.trim() === "") {
        this.$store.commit("setNotification", {
          text: "La contraseña de confirmación no puede estar vacía.",
          type: "warning",
          duration: 5,
        });
      } else if (this.inputs.newPassword != this.inputs.newPassword2) {
        this.$store.commit("setNotification", {
          text: "Las contraseñas no coinciden.",
          type: "warning",
          duration: 5,
        });
      } else {
        // Encriptar contraseña
        changePasswordAgent(
          {
            email: this.inputs.email,
            newPassword: this.inputs.newPassword,
          },
          (state, data) => {
            if (state == 200) {
              this.$store.commit("setNotification", {
                text: "Has cambiado tu contraseña correctamente",
                type: "success",
                duration: 5,
              });
            } else if (state == 404) {
              this.$store.commit("setNotification", {
                text: "El usuario no existe",
                type: "success",
                duration: 5,
              });
            }
          }
        );
      }
    },
  },
};
</script>

<style lang="scss">
.form-password-change {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: wrap;
  text-align: center;
  height: 70%;
}
</style>