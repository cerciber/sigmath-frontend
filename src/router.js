/**
 * Modulo que socia las rutas con sus respectivos componentes de Vue.
 *
 * @module router
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import VueRouter from "vue-router";

// Modulos creados
import mathpad from "./user_interface/views/mathpad.vue";
import login from "./user_interface/views/login.vue";
import signup from "./user_interface/views/signup.vue";
import userCards from "./user_interface/views/userCards.vue";
import password from "./user_interface/views/password.vue";


// Rutas
const router = new VueRouter({
  mode: "history", // Mantener las URLs limpias (Sin /#)
  routes: [
    {
      // Redireccionar ruta raiz
      path: "/",
      redirect: "/mathpad",
      meta: {
        auth: false
      }
    },
    {
      // Mathpad
      path: "/mathpad",
      component: mathpad,
      meta: {
        auth: false
      }
    },
    {
      // Login
      path: "/login",
      component: login,
      meta: {
        auth: false
      }
    },
    {
      // Logout
      path: "/logout",
      component: login,
      meta: {
        auth: false
      }
    },
    {
      // Signup
      path: "/signup",
      component: signup,
      meta: {
        auth: false
      }
    },
    {
      // Fichas del usuario
      path: "/user-cards",
      component: userCards,
      meta: {
        auth: true
      }
    },
    {
      // Rutas sin uso
      path: "*",
      redirect: "/login",
      meta: {
        auth: false
      }
    },
    {
      path: "/password",
      component: password,

    }
  ]
});

// Exportar rutas
export default router;
