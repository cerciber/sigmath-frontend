/**
 * Controlador que se encarga de realizar acciones internas de las fichas a nivel de información.
 * <pre>
 * - Convierte fichas en formato Json a codigo LaTeX listo para renderizar.
 * </pre>
 * @module controllers-card
 * @author Labeleon <labeleon@gmail.com>
 */

/**
 * Convertir una ficha en Formato Json a codigo LaTeX listo para renderizar con eventos.
 *
 * @param {json} card - Ficha matemática Json a convertir.
 * @returns {string} - LaTeX listo para renderizar.
 */
function getRenderLaTeX(card, writingParam) {
  // LaTeX original
  var latex = card.latexCode;

  // Tranformar parametros
  for (var i in card.params) {
    // Cambiar etiquetas del parametro por su valor envuelto en un componente html identificado por el "id" y la "class".
    latex = latex.replace(
      new RegExp("#" + (parseInt(i) + 1), "g"),
      "\\htmlClass{" +
        (card.params[i].content === null
          ? "emptyParam"
          : card.params[i] === writingParam
          ? "writingParam"
          : typeof card.params[i].content === "string"
          ? "nonWritingParam"
          : "fillParam") +
        "}{\\htmlId{" +
        "param." +
        card.id +
        "." +
        (parseInt(i) + 1) +
        "}{" +
        (card.params[i].content === null ||
        (typeof card.params[i].content === "string" &&
          card.params[i].content.trim() === "")
          ? card.params[i].symbol.trim() || "\\textcolor{red}{?}"
          : (card.params[i] !== writingParam ? "\\left(" : "") +
            (typeof card.params[i].content === "string"
              ? card.params[i].content
              : getRenderLaTeX(card.params[i].content, writingParam)) +
            (card.params[i] !== writingParam ? "\\right)" : "")) +
        "}}"
    );
  }

  return latex;
}

/**
 * Convertir una ficha en Formato Json a codigo LaTeX listo para renderizar sin eventos.
 *
 * @param {json} card - Ficha matemática Json a convertir.
 * @returns {string} - LaTeX listo para renderizar.
 */
function getRenderLaTeXNoEvents(card) {
  // LaTeX original
  var latex = card.latexCode;

  // Tranformar parametros
  for (var i in card.params) {
    // Cambiar etiquetas del parametro por su valor envuelto en un componente html identificado por el "id" y la "class".
    latex = latex.replace(
      new RegExp("#" + (parseInt(i) + 1), "g"),
      "\\htmlClass{" +
        (card.params[i].content === null ? "emptyParam" : "fillParam") +
        "}{" +
        (card.params[i].content === null
          ? card.params[i].symbol
          : "\\left(" +
            getRenderLaTeXNoEvents(card.params[i].content) +
            "\\right)") +
        "}"
    );
  }

  return latex;
}

/**
 * Contar el numero de parámetros de la función principal de python.
 *
 * @param {json} card - Ficha matemática Json a analizazr.
 * @returns {integer} - Numero de parametros.
 */
function countPythonParams(card) {
  var match = card.pythonCode.match(/def[ ]+main\(([^)]*?)\)[ ]*:/);
  if (!match) {
    return "El código Python debe tener una función 'main', ésta es la que determina las entradas y salidas de la ficha matemática.";
  }
  match = match[1].match(/[A-Za-z0-9_]+/g);
  return match ? match.length : 0;
}

/**
 * Contar el numero de parámetros de el codigo LaTeX.
 *
 * @param {json} card - Ficha matemática Json a analizazr.
 *  @returns {integer} - Numero de parametros.
 */
function countLaTeXParams(card) {
  var match = card.latexCode.match(/#[1-9]\d*/g);
  if (!match) {
    return 0;
  }
  var results = [];
  match.forEach(element => {
    element = parseInt(element.substring(1, element.length));
    if (!results.includes(element)) {
      results.push(element);
    }
  });
  return Math.max(...results) === results.length
    ? results.length
    : "Los parámetros del código LaTeX deben iniciar en 1 y no deben saltarse números en la secuencia de parámetros.";
}

/**
 * Verificar que los simbolos de LaTeX no sean numéricos.
 *
 * @param {json} card - Ficha matemática Json a analizazr.
 *  @returns {boolean} - Validación.
 */
function checkIncorrectLaTeXSymbols(card) {
  for (const param of card.params) {
    var match = param.symbol.match(/(^[1-9]+)|([+*/])|(-)/g);
    if (match) {
      return "Los símbolos de los parámetros no deberían ser números ni expresiones ya que estos no son operados matemáticamente.";
    }
  }
  return false;
}

// Exportar funciones
module.exports = {
  getRenderLaTeX,
  getRenderLaTeXNoEvents,
  countPythonParams,
  countLaTeXParams,
  checkIncorrectLaTeXSymbols
};
