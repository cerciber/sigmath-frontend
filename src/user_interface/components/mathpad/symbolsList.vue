<template>
  <div id="symbolsList" class="symbols-list-box">
    <b-form-input
      class="symbol-list-input"
      type="text"
      placeholder="Ej: Integral"
    />
    <ul>
      <li class="symbol-list">
        <div
          class="symbol-list-element"
          v-katex:display="{
            expression: 'x^2',
            options: { throwOnError: false }
          }"
        ></div>
        <div class="name-list">Integral</div>
      </li>
      <li class="symbol-list">
        <div
          class="symbol-list-element"
          v-katex:display="{
            expression: 'x^2',
            options: { throwOnError: false }
          }"
        ></div>
        <div class="name-list">Integral</div>
      </li>
      <li class="symbol-list">
        <div
          class="symbol-list-element"
          v-katex:display="{
            expression: 'x^2',
            options: { throwOnError: false }
          }"
        ></div>
        <div class="name-list">Integral</div>
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * Lista de simbolos de la nueva ficha.
 *
 * @module SymbolsListVue
 * @author Labeleon <labeleon@gmail.com>
 */

/**
 *
 */
export default {
  name: "SymbolsList"
};
</script>

<style>
/* contenido CSS*/
.symbols-list-box {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 5px;
  min-height: 150px;
  max-height: 150px;
}
.symbol-list-input {
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 5px;
  background-color: transparent;
  font-family: "Titillium Web";
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  color: #b9b9b9;
  margin: 4%;
  max-width: 92%;
}
.symbol-list-input:focus {
  background-color: transparent;
  color: #b9b9b9;
  border: 2px solid #f07513;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: none;
}

ul {
  list-style: none;
  margin: 0px;
  padding: 0% 0% 0% 4%;
}

.symbol-list {
  display: flex;
}

.name-list {
  margin: 1%;
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
  padding-left: 10%;
}

.symbol-list-element > .katex-display {
  padding: 0px;
  margin: 10% 10% 10% 20% !important;
}
</style>
