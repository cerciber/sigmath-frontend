/**
 * Modulo principal en el cual se realiza la creación de intancia de Vue.
 * - Usa un renderizador de notación matemática KaTeX.
 * - Usa un componente que permite redimenzionar y transformar otros componentes.
 * - Usa un componente que permite realizar zoom a otros componentes.
 * - Usa los componentes de Bootstap vue
 *
 * @module main
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Vue from "vue";
import VueRouter from "vue-router";
import VueKatex from "vue-katex";
import Moveable from "vue-moveable";
import panZoom from "vue-panzoom";
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueCodemirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/python/python.js";
import "codemirror/mode/stex/stex.js";
import "codemirror/theme/rubyblue.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import StarRating from "vue-star-rating";

// Modulos creados
import App from "./user_interface/App";
import temporalStore from "./local_storage/temporalStore";
import router from "./router";

// Usar manejo de rutas
Vue.use(VueRouter);

// Usar renderizador de notación matemática KaTeX
Vue.use(VueKatex, {
  globalOptions: {
    trust: context => {
      return (
        context.command === "\\htmlId" || context.command === "\\htmlClass" // Permitir HTML id y class en el codigo LaTeX
      );
    },
    strict: false // Omitir errores del modo estricto
  }
});

// Usar componente que permite redimenzionar y transformar otros componentes
Vue.component("Moveable", Moveable);

Vue.component("star-rating", StarRating);

// Usar componente que permite realizar zoom a otros componentes
Vue.use(panZoom);

// Usar los componentes de Bootstap vue
Vue.use(BootstrapVue);

// Usar visualizador de codigo
Vue.use(VueCodemirror);

// Autenticación firebase
var firebaseConfig = {
  apiKey: "AIzaSyDBRbIqGNmVMW2poyse0apBIr9gTBOjjEg",
  authDomain: "sigmath.firebaseapp.com",
  databaseURL: "https://sigmath.firebaseio.com",
  projectId: "sigmath",
  storageBucket: "sigmath.appspot.com",
  messagingSenderId: "951460065101",
  appId: "1:951460065101:web:bad7b57c5a6ec8c6c65104",
  measurementId: "G-KHXD851WPZ"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Realizar verificaciones en las rutas entes de direccionar
router.beforeEach((to, from, next) => {
  // Verificar si el usuario está logueado
  const user = firebase.auth().currentUser;

  // Si el usuario va a mis fichas y el usuario no está autenticado
  if (!user && to.path === "/user-cards") {
    // Enviar al usuario al login
    next("login");
  }

  // Si el usuario va a mis login o signup  y el usuario está autenticado
  else if (user && (to.path === "/login" || to.path === "/signup")) {
    // Enviar al usuario al mathpad
    next("mathpad");
  }

  // En otro caso
  else {
    // Continuar
    next();
  }
});

// Detectar estado de la autenticación del usuario una vez para crear una unica instancia de Vue
var createVueInstance = true;
firebase.auth().onAuthStateChanged(() => {
  if (createVueInstance) {
    // Crear instancia de Vue
    new Vue({
      el: "#app",
      router: router,
      store: temporalStore,
      render: h => h(App)
    });
    createVueInstance = false;
  }
});
