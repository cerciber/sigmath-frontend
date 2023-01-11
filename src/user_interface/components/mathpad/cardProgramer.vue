<template>
  <div class="card-programer">
    <div v-if="!$store.state.movil">
      <SplitGrid
        class="card-programer-resizable"
        :strictMode="false"
        v-if="$store.state.mathpad.programingCard"
      >
        <!-- Barra lateral izquierda -->
        <SplitGridArea class="card-programer-resizable1" :strictMode="false">
          <div class="card-programer-left">
            <div class="card-programer-left-top">
              <b-button
                class="card-programer-symbols-button"
                v-if="$store.state.movil"
                >Abrir editor de parametros</b-button
              >
              <b-form-select
                class="card-programer-listbox"
                v-model="languajeList.selected"
                :options="languajeList.options"
              ></b-form-select>
            </div>
            <div
              class="card-programer-codemirror"
              v-if="languajeList.selected == 'Latex'"
            >
              <codemirror
                class="card-programer-codemirror"
                ref="codemirrorLatex"
                :value="programingCard ? programingCard.latexCode : ''"
                :options="cmOptionLaTeX"
                @input="onCmCodeChangeLaTeX"
              ></codemirror>
            </div>
            <div class="card-programer-codemirror" v-else>
              <codemirror
                class="card-programer-codemirror"
                ref="codemirrorPython"
                :value="programingCard ? programingCard.pythonCode : ''"
                :options="cmOptionPython"
                @input="onCmCodeChangePython"
              ></codemirror>
            </div>
          </div>
        </SplitGridArea>
        <SplitGridGutter />
        <!-- Barra lateral derecha -->
        <SplitGridArea class="card-programer-resizable2" :strictMode="false">
          <div class="card-programer-right">
            <div class="card-programer-right-top">
              <Close
                class="card-programer-close-icon"
                v-on:click="hideProgramer"
              />
            </div>
            <div class="card-programer-right-content">
              <!-- Si existe una carta seleccionada mostrar el formulario de caracteristicas -->
              <div v-if="programingCard !== null">
                <div
                  v-b-toggle="'programer-collapse-1'"
                  class="font-normal-3 default-card-category"
                  v-on:click="onToggleClick('programer-collapse-1')"
                >
                  <div
                    class="default-cards-arrow"
                    v-show="collapseStates['programer-collapse-1']"
                  >
                    &#9660;
                  </div>
                  <div
                    class="default-cards-arrow"
                    v-show="!collapseStates['programer-collapse-1']"
                  >
                    &#9658;
                  </div>
                  <div class="default-cards-category">Opciones</div>
                </div>
                <b-collapse
                  v-bind:id="'programer-collapse-1'"
                  :ref="'programer-collapse-1'"
                  class="card-programer-category-content"
                  visible
                >
                  <div class="card-feature-buttons">
                    <!-- Lista de parámetros -->
                    <b-button
                      class="button-2 font-help-2 card-feature-button"
                      v-on:click="addParam"
                    >
                      <Plus></Plus> Añadir
                    </b-button>
                  </div>
                </b-collapse>
                <!-- Lista de parámetros -->
                <div v-if="programingCard.params.length > 0">
                  <div
                    v-b-toggle="'programer-collapse-2'"
                    class="font-normal-3 mb-2 default-card-category"
                    v-on:click="onToggleClick('programer-collapse-2')"
                  >
                    <div
                      class="default-cards-arrow"
                      v-show="collapseStates['programer-collapse-2']"
                    >
                      &#9660;
                    </div>
                    <div
                      class="default-cards-arrow"
                      v-show="!collapseStates['programer-collapse-2']"
                    >
                      &#9658;
                    </div>
                    <div class="default-cards-category">
                      Símbolos de los parámetros
                    </div>
                  </div>
                  <b-collapse
                    v-bind:id="'programer-collapse-2'"
                    :ref="'programer-collapse-2'"
                    class="card-features-category-content"
                    visible
                  >
                    <div class="card-feature-li">
                      <div
                        v-for="(param, i) in programingCard.params"
                        :key="param.id"
                      >
                        <div class="font-small-2 card-programer-symbol-counter">
                          #{{ parseInt(i + 1) }}
                        </div>
                        <div
                          class="card-feature-symbol"
                          v-katex:display="{
                            expression:
                              param.symbol.trim() || '\\textcolor{red}{?}',
                            options: { throwOnError: false, errorColor: 'red' }
                          }"
                        ></div>
                        <b-form-input
                          class="input-text-1 font-normal-1 card-feature-input mt-2 mb-2"
                          type="text"
                          v-model="param.symbol"
                          placeholder="Ingrese un simbolo LaTeX"
                          @keyup.native="onKeyUp"
                        />
                        <b-button
                          class="button-2 font-help-2 card-programer-button"
                          v-on:click="removeParam(i)"
                        >
                          <Minus></Minus> Borrar
                        </b-button>
                      </div>
                    </div>
                  </b-collapse>
                </div>
              </div>
            </div>
          </div>
        </SplitGridArea>
      </SplitGrid>
    </div>
    <div v-else>
      <SplitGrid
        class="card-programer-resizable"
        :strictMode="false"
        v-if="$store.state.mathpad.programingCard"
      >
        <!-- Barra lateral izquierda -->
        <SplitGridArea class="card-programer-resizable1" :strictMode="false">
          <div class="card-programer-left">
            <div class="card-programer-left-top">
              <b-button
                class="card-programer-symbols-button"
                v-if="$store.state.movil"
                @click="onParamsEditor"
                >{{
                  paramsEditor
                    ? "Cerrar editor de parámetros"
                    : "Abrir editor de parámetros"
                }}</b-button
              >
              <b-form-select
                class="card-programer-listbox"
                v-model="languajeList.selected"
                :options="languajeList.options"
              ></b-form-select>
            </div>
            <div v-if="paramsEditor">
              <div class="card-programer-right-content">
                <!-- Si existe una carta seleccionada mostrar el formulario de caracteristicas -->
                <div v-if="programingCard !== null">
                  <div
                    v-b-toggle="'programer-collapse-1'"
                    class="font-normal-3 default-card-category"
                    v-on:click="onToggleClick('programer-collapse-1')"
                  >
                    <div
                      class="default-cards-arrow"
                      v-show="collapseStates['programer-collapse-1']"
                    >
                      &#9660;
                    </div>
                    <div
                      class="default-cards-arrow"
                      v-show="!collapseStates['programer-collapse-1']"
                    >
                      &#9658;
                    </div>
                    <div class="default-cards-category">Opciones</div>
                  </div>
                  <b-collapse
                    v-bind:id="'programer-collapse-1'"
                    :ref="'programer-collapse-1'"
                    class="card-programer-category-content"
                    visible
                  >
                    <div class="card-feature-buttons">
                      <!-- Lista de parámetros -->
                      <b-button
                        class="button-2 font-help-2 card-feature-button"
                        v-on:click="addParam"
                      >
                        <Plus></Plus> Añadir
                      </b-button>
                    </div>
                  </b-collapse>
                  <!-- Lista de parámetros -->
                  <div v-if="programingCard.params.length > 0">
                    <div
                      v-b-toggle="'programer-collapse-2'"
                      class="font-normal-3 mb-2 default-card-category"
                      v-on:click="onToggleClick('programer-collapse-2')"
                    >
                      <div
                        class="default-cards-arrow"
                        v-show="collapseStates['programer-collapse-2']"
                      >
                        &#9660;
                      </div>
                      <div
                        class="default-cards-arrow"
                        v-show="!collapseStates['programer-collapse-2']"
                      >
                        &#9658;
                      </div>
                      <div class="default-cards-category">
                        Símbolos de los parámetros
                      </div>
                    </div>
                    <b-collapse
                      v-bind:id="'programer-collapse-2'"
                      :ref="'programer-collapse-2'"
                      class="card-features-category-content"
                      visible
                    >
                      <div class="card-feature-li">
                        <div
                          v-for="(param, i) in programingCard.params"
                          :key="param.id"
                        >
                          <div
                            class="font-small-2 card-programer-symbol-counter"
                          >
                            #{{ parseInt(i + 1) }}
                          </div>
                          <div
                            class="card-feature-symbol"
                            v-katex:display="{
                              expression:
                                param.symbol.trim() || '\\textcolor{red}{?}',
                              options: {
                                throwOnError: false,
                                errorColor: 'red'
                              }
                            }"
                          ></div>
                          <b-form-input
                            class="input-text-1 font-normal-1 card-feature-input mt-2 mb-2"
                            type="text"
                            v-model="param.symbol"
                            placeholder="Ingrese un simbolo LaTeX"
                            @keyup.native="onKeyUp"
                          />
                          <b-button
                            class="button-2 font-help-2 card-programer-button"
                            v-on:click="removeParam(i)"
                          >
                            <Minus></Minus> Borrar
                          </b-button>
                        </div>
                      </div>
                    </b-collapse>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                class="card-programer-codemirror"
                v-if="languajeList.selected == 'Latex'"
              >
                <codemirror
                  class="card-programer-codemirror"
                  ref="codemirrorLatex"
                  :value="programingCard ? programingCard.latexCode : ''"
                  :options="cmOptionLaTeX"
                  @input="onCmCodeChangeLaTeX"
                ></codemirror>
              </div>
              <div class="card-programer-codemirror" v-else>
                <codemirror
                  class="card-programer-codemirror"
                  ref="codemirrorPython"
                  :value="programingCard ? programingCard.pythonCode : ''"
                  :options="cmOptionPython"
                  @input="onCmCodeChangePython"
                ></codemirror>
              </div>
            </div>
          </div>
        </SplitGridArea>
      </SplitGrid>
    </div>
  </div>
</template>

<script>
/**
 * Componente para crear una ficha matemática por programación.
 *
 * @module interface-components-mathpad-card-programer
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos instalados
import { SplitGrid, SplitGridArea, SplitGridGutter } from "vue-split-grid";
import Close from "vue-material-design-icons/Close.vue";
import Plus from "vue-material-design-icons/PlusCircleOutline";
import Minus from "vue-material-design-icons/MinusCircleOutline";

// Modulos creados
import canvasController from "../../../controllers/canvasController";
import cardController from "../../../controllers/cardController";

/**
 * @vue-data {json} languajeList - Información de la lista de lenguajes.
 * @vue-data {string} [languajeList.selected = Latex] - Lenguaje seleccionado.
 * @vue-data {json[]} languajeList.options - Información de cada item de la lista.
 * @vue-data {string} languajeList.options.value - Identificador del item.
 * @vue-data {string} languajeList.options.text - Texto del item.
 * @vue-data {json} cmOptionLaTeX - Información del editor de codigo de LaTeX.
 * @vue-data {integer} [cmOptionLaTeX.tabSize = 2] - Número de espacios al hacer tab.
 * @vue-data {boolean} [cmOptionLaTeX.lineNumbers = true] - Mostrar el numero de cada linea de codigo.
 * @vue-data {string} [cmOptionLaTeX.mode = text/x-stex] - Sintaxis del lenguaje.
 * @vue-data {string} [cmOptionLaTeX.theme = rubyblue] - Tema del editor.
 * @vue-data {integer} [cmOptionLaTeX.tabSize = 2] - Número de espacios al hacer tab.
 * @vue-data {boolean} [cmOptionLaTeX.lineNumbers = true] - Mostrar el numero de cada linea de codigo.
 * @vue-data {string} [cmOptionLaTeX.mode = text/x-python] - Sintaxis del lenguaje.
 * @vue-data {string} [cmOptionLaTeX.theme = rubyblue] - Tema del editor.
 *
 * @vue-computed {json} programingCard - Ficha matemática que se está programando.
 */
export default {
  name: "cardProgramer",
  data() {
    return {
      languajeList: {
        selected: "Latex",
        options: [
          { value: "Latex", text: "Latex" },
          { value: "Python", text: "Python" }
        ]
      },
      cmOptionLaTeX: {
        tabSize: 2,
        lineNumbers: true,
        mode: "text/x-stex",
        theme: "rubyblue"
      },
      cmOptionPython: {
        tabSize: 2,
        lineNumbers: true,
        mode: "text/x-python",
        theme: "rubyblue"
      },
      collapseStates: {
        "programer-collapse-1": true,
        "programer-collapse-2": true
      },
      paramsEditor: false
    };
  },
  components: {
    SplitGrid,
    SplitGridArea,
    SplitGridGutter,
    Close,
    Plus,
    Minus
  },
  methods: {
    /**
     * Ocultar panel de programación.
     */
    hideProgramer() {
      // Ocultar panel de programación
      this.$store.commit("setMathpadNoProgramCard");
    },

    /**
     * Añadir parametro a la ficha que se está programando.
     */
    addParam() {
      this.$store.state.mathpad.programingCard.params.push(
        JSON.parse(
          JSON.stringify(
            this.$store.state.mathpad.newProgrammingCardParameterScheme
          )
        )
      );
      this.$store.commit("checkParams");
    },

    /**
     * Remover parametro de la ficha que se está programando en la posición especificada.
     *
     * @param {integer} pos - Posición del parametro a remover.
     */
    removeParam(pos) {
      this.$store.state.mathpad.programingCard.params.splice(pos, 1);
      this.$store.commit("checkParams");
    },

    /**
     * Acciones al cambiar el codigo LaTeX en el editor
     *
     * @param {string} newCode - Codigo después del cambio.
     */
    onCmCodeChangeLaTeX(newCode) {
      // Cambiar el codigo LaTeX de la ficha
      this.programingCard.latexCode = newCode;
      this.$store.commit("checkParams");
    },

    /**
     * Acciones al cambiar el codigo Python en el editor
     *
     * @param {string} newCode - Codigo después del cambio.
     */
    onCmCodeChangePython(newCode) {
      // Cambiar el codigo Python de la ficha
      this.programingCard.pythonCode = newCode;
      this.$store.commit("checkParams");
    },

    onToggleClick(collapseRef) {
      if (!this.collapseStates[collapseRef]) {
        this.collapseStates[collapseRef] = true;
      } else {
        this.collapseStates[collapseRef] = false;
      }
      this.$refs[collapseRef].show = this.collapseStates[collapseRef];
    },

    onKeyUp() {
      var result = cardController.checkIncorrectLaTeXSymbols(
        this.programingCard
      );
      if (result) {
        this.$store.commit("setNotification", {
          text: result,
          type: "warning",
          duration: 5
        });
      }
    },

    onParamsEditor() {
      this.paramsEditor = !this.paramsEditor;
    }
  },
  computed: {
    /**
     * Obtener ficha que se está programando.
     */
    programingCard() {
      return this.$store.state.mathpad.programingCard;
    }
  }
};
</script>

<style>
.card-programer {
  width: 100%;
  height: 100%;
  background: #02174c;
}
.card-programer-resizable {
  width: 100%;
  height: 700px;
}
.card-programer-resizable1 {
  width: 100%;
  height: 100%;
}
.card-programer-resizable2 {
  width: 100%;
  height: 100%;
}
.card-programer-left {
  width: 100%;
  height: 100%;
}
.card-programer-right {
  width: 100%;
  height: 100%;
}
.card-programer-left-top {
  height: 30px;
  width: 100%;
}
.card-programer-right-top {
  height: 30px;
}
.card-programer-right-content {
  width: 100%;
  height: calc(100% - 25px);
  background: var(--background-color-4) !important;
  overflow: auto;
  padding-bottom: 20px;
}

.card-programer-codemirror {
  height: 700px;
}

@media only screen and (max-width: 768px) {
  .card-programer-right-content {
    height: 700px;
  }
}

.CodeMirror {
  height: 100%;
}
.card-programer-symbols-button {
  margin: auto;
  margin-top: 4px;
  margin-left: 4px;
  width: 150px;
  height: 19px;
  background: #f07513;
  border-radius: 10px;
  padding: 0px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  border: none;
  box-shadow: none !important;
  float: left;
}
.card-programer-symbols-button:focus {
  background: #f07513 !important;
}
.card-programer-symbols-button:active {
  background: #c55e0c !important;
}
.card-programer-symbols-button:visited {
  background: #f07513 !important;
}
.card-programer-symbols-button:disabled {
  background: #f07513 !important;
}
.card-programer-symbols-button:hover {
  background: #f39244;
}
.card-programer-listbox {
  margin: auto;
  margin-top: 3px;
  width: 105px;
  height: 19px;
  background: #02174c;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0px;
  padding-left: 8px;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  line-height: 15px;
  color: rgba(255, 255, 255, 0.5);
  box-shadow: none !important;
  float: right;
}
@media only screen and (max-width: 768px) {
  .card-programer-listbox {
    margin-top: 6px;
    margin-right: 5px;
  }
  .card-programer-symbols-button {
    margin-top: 7px;
  }
}
.card-programer-close-icon {
  display: flex;
  margin-top: -2px;
  align-items: center;
  height: 100%;
  color: #6a94ff;
  float: right;
}
.card-programer-close-icon:hover {
  cursor: pointer;
  color: #ffffff;
}

.card-programer-title {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  margin-top: 15px;
  margin-left: 20px;
  margin-bottom: 1px;
}
.card-programer-input {
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 5px;
  height: 35px;
  margin-left: 20px;
  width: calc(100% - 40px);
  background-color: transparent;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: #b9b9b9;
}
.card-programer-input:focus {
  background-color: transparent;
  color: #b9b9b9;
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}
.card-programer-text-area {
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 5px;
  margin-left: 20px;
  width: calc(100% - 40px);
  background-color: transparent;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: #b9b9b9;
}
.card-programer-text-area:focus {
  background-color: transparent;
  color: #b9b9b9;
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  margin-left: 20px;
  margin-top: -2px;
  box-shadow: none;
}
.card-programer-li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.card-programer-symbol-counter {
  color: var(--text-color-2);
  margin-bottom: -24px;
  margin-left: 23px;
}
.card-programer-button {
  color: var(--text-color-2) !important;
  width: 80px;
  margin-left: 20px;
  margin-top: 0px;
  margin-bottom: 10px;
}
</style>
