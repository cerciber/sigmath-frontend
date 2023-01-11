/**
 * Almacenamineto de información temporal centralizado para todos los componentes Vue. (Vuex)
 * <pre>
 * - Contiene el estado del MathPad.
 * - Contiene el estado de la busqueda de fichas.
 * </pre>
 * @module storage-temporal-store
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import Vue from "vue";
import Vuex from "vuex";

// Modulos creados
import canvasController from "../controllers/canvasController";
import cardController from "../controllers/cardController";

// Usar Vuex
Vue.use(Vuex);

// Estados del sistema
const state = {
  mathpad: {
    fileName: "",
    selectedCard: null,
    draggedCard: null,
    programingCard: null,
    writingParam: null,
    writingCard: null,
    writingLastCard: null,
    results: [],
    resultsState: "initial",
    programCard: false,
    elementWithControllers: null,
    canvasControllers: false,
    zoomByDoubleClick: false,
    scale: 1,
    focusEcuationInput: false,
    newEcuationInputText: "",
    grid: true,
    newProgrammingCardScheme: {
      title: "Integral indefinida",
      description: "Integral indefinida de una expresión matemática",
      params: [
        {
          symbol: "f",
          description: "Expresión matemática",
          content: null
        },
        {
          symbol: "x",
          description: "Símbolo sobre el cual se realiza la integración",
          content: null
        }
      ],
      latexCode: "\\int {#1}\\ d{#2}",
      pythonCode: "def main(f, x):\n  return integrate(f, Symbol(x))"
    },
    newProgrammingCardParameterScheme: {
      symbol: "x",
      description: "Parametro x",
      content: null
    }
  },
  notifications: {
    idCont: 1,
    list: []
  },
  user: {
    logged: false,
    email: undefined,
    nickname: undefined
  },
  movil: false
};

// Funciones que gestionan los estados globalmente
export const mutations = {
  /**
   * Asignar nombre del archivo del MathPad.
   *
   * @param {number} state - Estados del sistema.
   * @param {json} params - Parametros de la función.
   * @param {string} params.fileName - Nombre del archivo.
   */
  setMathpadFileName(state, { fileName }) {
    state.mathpad.fileName = fileName;
  },

  /**
   * Asignar ficha seleccionada en el lienzo.
   *
   * @param {number} state - Estados del sistema.
   * @param {json} params - Parametros de la función.
   * @param {json} params.selectedCard - Ficha seleccionada.
   */
  setMathpadSelectedCard(state, { selectedCard }) {
    state.mathpad.selectedCard = selectedCard;
    state.mathpad.programingCard = selectedCard;
  },

  /**
   * Asignar ficha que se está arrastrando en el lienzo.
   *
   * @param {number} state - Estados del sistema.
   * @param {json} params - Parametros de la función.
   * @param {json} params.draggedCard - Ficha que se está arrastrando.
   */
  setMathpadDraggedCard(state, { draggedCard }) {
    state.mathpad.draggedCard = draggedCard;
  },

  /**
   * Asignar resultados de la busqueda de fichas.
   *
   * @param {number} state - Estados del sistema.
   * @param {json} params - Parametros de la función.
   * @param {json[]} params.results - Lista de fichas obtenidas en la busqueda.
   */
  setMathpadResults(state, { results }) {
    state.mathpad.results = results;
  },

  /**
   * Mostrar panel de resultados de la búsqueda.
   *
   * @param {number} state - Estados del sistema.
   */
  initialResults(state) {
    state.mathpad.resultsState = "initial";
  },

  /**
   * Mostrar panel de resultados de la búsqueda.
   *
   * @param {number} state - Estados del sistema.
   */
  showResults(state) {
    state.mathpad.resultsState = "show";
  },

  /**
   * Ocultar panel de resultados de la búsqueda.
   *
   * @param {number} state - Estados del sistema.
   */
  hideResults(state) {
    state.mathpad.resultsState = "hide";
  },

  /**
   * Asignar que se esta programando una ficha.
   *
   * @param {number} state - Estados del sistema.
   */
  setMathpadProgramCard(state) {
    state.mathpad.programCard = true;
  },

  /**
   * Asignar que no se esta programando una ficha.
   *
   * @param {number} state - Estados del sistema.
   */
  setMathpadNoProgramCard(state) {
    state.mathpad.programCard = false;
    state.mathpad.programingCard = null;
  },

  /**
   * Asignar nueva ficha para programar.
   *
   * @param {number} state - Estados del sistema.
   */
  setNewProgrammigCard(state) {
    var card = JSON.parse(
      JSON.stringify(state.mathpad.newProgrammingCardScheme)
    );
    card.solvedOf = state.mathpad.selectedCard;
    state.mathpad.programingCard = canvasController.addCard(card);
    state.mathpad.selectedCard = state.mathpad.programingCard;
  },

  /**
   * Eliminar notificación.
   *
   * @param {number} state - Estados del sistema.
   * @param {number} position - Posicion en la lista
   */

  deleteNotification(state, { idNotification }) {
    var index = state.notifications.list
      .map(e => e.idNotification)
      .indexOf(idNotification);
    state.notifications.list.splice(index, 1);
  },

  /**
   * Crear notificación.
   *
   * @param {number} state - Estados del sistema.
   * @param {number} text - Texto a mostrar en la notificación.
   * @param {number} type - Typo/Variante de la notificación.
   * @param {number} duration - Duración de la notificación.
   */

  setNotification(state, { text, type, duration }) {
    // Borrar mensajes repetidos
    for (var element of state.notifications.list) {
      if (element.text === text) {
        this.commit("deleteNotification", {
          idNotification: element.idNotification
        });
      }
    }
    state.notifications.list.unshift({
      idNotification: state.notifications.idCont++,
      position: state.notifications.list.length,
      text: text,
      type: type,
      duration: duration,
      timeLeft: duration + 1,
      notificationState: true
    });
  },

  /**
   * Reducir tiempo restante de notificación.
   *
   * @param {number} state - Estados del sistema.
   * @param {number} position - Posicion en la lista
   */

  notificationTimeDecrease(state, idNotification) {
    var index = state.notifications.list
      .map(e => e.idNotification)
      .indexOf(idNotification);
    state.notifications.list[index].timeLeft--;
    if (state.notifications.list[index].timeLeft === 0) {
      this.commit("deleteNotification", {
        idNotification: state.notifications.list[index].idNotification
      });
    }
  },

  /**
   * Asignar los controles de redimensionamiento a un elemento.
   */
  setControllersTo(state, { card }) {
    state.mathpad.elementWithControllers = card;
  },

  /**
   * Asignar o no los controles del canvas
   */
  canvasControllers(state, { value }) {
    state.mathpad.canvasControllers = value;
  },

  /**
   * Validar si el zoom se hará a través de doble click.
   */
  zoomByDoubleClick(state, { value }) {
    state.mathpad.zoomByDoubleClick = value;
  },

  /**
   * Asignar escala.
   */
  setScale(state, { scale }) {
    state.mathpad.scale = scale;
  },

  /**
   * Asignar datos del usuario.
   */
  setUserData(state, { nickname, email }) {
    state.user.nickname = nickname;
    state.user.email = email;
  },

  /**
   * Asignar si el usuario se encuentra autenticado.
   */
  setUserIsLogged(state, { logged }) {
    state.user.logged = logged;
  },

  /**
   * Asignar las fichas del usuario
   */
  setUserCards(state, { cards }) {
    state.user.cards = cards;
  },

  /**
   * Verificar la consistencia de los parámetros.
   */
  checkParams(state) {
    // Verificar que los parametros sean consistentes
    var latexCont = cardController.countLaTeXParams(
      state.mathpad.programingCard
    );
    var pythonCont = cardController.countPythonParams(
      state.mathpad.programingCard
    );
    if (typeof latexCont === "string") {
      this.commit("setNotification", {
        text: latexCont,
        type: "warning",
        duration: 5
      });
    } else if (typeof pythonCont === "string") {
      this.commit("setNotification", {
        text: pythonCont,
        type: "warning",
        duration: 5
      });
    } else if (latexCont !== pythonCont) {
      this.commit("setNotification", {
        text:
          "El número de parámetros entre el código Python y el código LaTeX no coinciden.",
        type: "warning",
        duration: 5
      });
    } else if (latexCont !== state.mathpad.programingCard.params.length) {
      this.commit("setNotification", {
        text:
          "El numero de parámetros entre los códigos y la lista de parámetros no coinciden.",
        type: "warning",
        duration: 5
      });
    }
  },

  setWritingParam(state, { cardRoot, param }) {
    this.commit("setNewEcuationInputText", {
      text: ""
    });
    if (
      state.mathpad.writingParam &&
      typeof state.mathpad.writingParam.content === "string" &&
      state.mathpad.writingParam.content.trim() === ""
    ) {
      state.mathpad.writingParam.content = null;
    }
    if (!param) {
      state.mathpad.writingParam = param;
      state.mathpad.writingLastCard = state.mathpad.writingCard;
      state.mathpad.writingCard = cardRoot;
    } else if (param.content === null) {
      state.mathpad.writingParam = param;
      state.mathpad.writingLastCard = state.mathpad.writingCard;
      state.mathpad.writingCard = cardRoot;
      state.mathpad.writingParam.content = "";
      state.mathpad.focusEcuationInput = true;
    } else if (typeof param.content === "string") {
      state.mathpad.writingParam = param;
      state.mathpad.writingLastCard = state.mathpad.writingCard;
      state.mathpad.writingCard = cardRoot;
      this.commit("setNewEcuationInputText", {
        text: param.content
      });
      state.mathpad.focusEcuationInput = true;
    }
    if (state.mathpad.writingCard) {
      state.mathpad.writingCard.update = true;
    }
    if (state.mathpad.writingLastCard) {
      state.mathpad.writingLastCard.update = true;
    }
    if (cardRoot) {
      cardRoot.update = true;
    }
  },

  setNewEcuationInputText(state, { text }) {
    state.mathpad.newEcuationInputText = text;
  },

  /**
   * Asignar las fichas del usuario
   */
  setGridState(state, { value }) {
    state.mathpad.grid = value;
  },

  /**
   * Verificar si el explorador es para moviles
   */
  checkMovil(state, { value }) {
    state.movil = value;
  }
};

// Exportar almacenamiento global centralizado
export default new Vuex.Store({
  state: state,
  mutations: mutations
});
