/**
 * Controlador que se encarga de realizar acciones del lienzo a nivel de información.
 * <pre>
 * - Gestiona la lista de fichas que se encuentan actualmente en el lienzo.
 * - Genera identificadores para las nuevas fichas del lienzo.
 * - Realiza el acoplamiento y desacoplamiento de las fichas a nivel de información.
 * </pre>
 * @module controllers-canvas
 * @author Labeleon <labeleon@gmail.com>
 */

// Lista de cartas en el lienzo
var cards = [];

// Contador de identificadores
var countId = 0;

/**
 * Obtiene un nuevo id que no esté asignado en la lista de fichas en el lienzo.
 *
 * @returns {integer} - Id de fucha nuevo, que no ha sido asignado aún.
 */
function getNewID() {
  countId++;
  return countId;
}

// Contador de identificadores
var countId = 0;

/**
 * Asignar Id's a las fichas del lienzo.
 *
 * @returns {integer} - Id de fucha nuevo, que no ha sido asignado aún.
 */
function setIDs(card) {
  // Asignarle un ID
  card.id = getNewID();
  // Asignarle el ID a las subfichas
  for (var param of card.params) {
    if (param.content) {
      setIDs(param.content);
    }
  }
}

/**
 * Agregar una nueva ficha en la lista de ficha en el lienzo.
 *
 * @param {json} card - Json de una ficha.
 * @returns {object} - Json de la mima ficha con datos adicionales para su implementación.
 */
function addCard(card) {
  // Crear copia de la ficha (Para asegurar que la nueva ficha sea totalmente indepndiente al resto)
  card = JSON.parse(JSON.stringify(card));

  // Asignarle ID's
  setIDs(card);

  // Asignar caracteristicas si no las tiene
  if (!card.bounds) {
    card.bounds = {
      scale: 1,
      transform: "matrix(1,0,0,1,0,0) translate(20px, 20px)"
    };
  }
  if (!card.bounds.scale) {
    card.bounds.scale = 1;
  }
  if (!card.bounds.transform) {
    card.bounds.transform = "matrix(1,0,0,1,0,0) translate(20px, 10px)";
  }
  if (!card.loading) {
    card.loading = false;
  }
  if (!card.inDragger) {
    card.inDragger = false;
  }
  if (!card.update) {
    card.update = false;
  }
  if (!card.unacoplable) {
    card.unacoplable = true;
  }

  // Agregar carta al final de la lista
  cards.push(card);

  // Devolver la misma carta
  return card;
}

/**
 * Acoplar una ficha como un parametro de otra ficha.
 *
 * @param {json} cardParam - Ficha que será acoplada en el parametro de otra ficha.
 * @param {json} cardContent - Ficha que tiene el parametro a ser asignado.
 * @param {integer} pos - Posición del parametro en la ficha.
 * @returns {boolean} - Estado del acoplamiento. True si se acopló correctamente. False si no se posible hacer el desacoplamiento.
 */
function addParam(cardParam, cardContent, pos) {
  if (cardParam) {
    // Si la ficha contenedora no tiene ya un parametro asignado
    if (!cardContent.params[pos].content) {
      // Borrar metadata
      deleteMetadata(cardParam);

      cardContent.params[pos].content = cardParam;
      cards.splice(cards.indexOf(cardParam), 1);
      return true;
    }
  }

  return false;
}

/**
 * Remover el parametro de una ficha y lo ingresa como un ficha independiente en la lista.
 *
 * @param {json} cardContent - Ficha a la cual se le extrae un parametro.
 * @param {integer} pos - Posición del parametro de la ficha.
 * @returns {boolean} - Estado del deacoplamiento. True si se desacopló correctamente. False si no es posible hacer el desacoplamiento.
 */
function removeParam(cardContent, pos) {
  if (cardContent.params[pos].content) {
    const param = cardContent.params[pos].content;
    cardContent.params[pos].content = null;
    return addCard(param);
  }
  return false;
}

/**
 * Remover ficha de la lista.
 *
 * @param {json} card - Ficha que será removida del lienzo.
 */
function removeCard(card) {
  cards.splice(cards.indexOf(card), 1);
}

/**
 * Limpiar lienzo.
 */
function clean() {
  while (cards.length) {
    cards.pop();
  }
}

/**
 * Borrar metadata.
 */
function deleteMetadata(card) {
  if (card.bounds) {
    delete card.bounds;
  }
  if (card.inDragger) {
    delete card.inDragger;
  }
  if (card.loading) {
    delete card.loading;
  }
}

/**
 * Acoplar una ficha como un parametro de otra ficha a partir de coordenadas.
 */
function addParamByCordinates(paramCard, clientX, clientY) {
  for (const card of cards) {
    // Obtener coordenadas
    var results = card.bounds.transform.match(
      /matrix\((.*),(.*),(.*),(.*),(.*),(.*)\) translate\((.*)px, (.*)px\)/
    );
    var posX = parseFloat(results[5]) + parseFloat(results[7]);
    var posY = parseFloat(results[6]) + parseFloat(results[8]);
    var paramRect = document
      .getElementById("card" + card.id)
      .getBoundingClientRect();

    // Verificar si hay una ficha en las coordeandas
    if (
      card !== paramCard &&
      clientX > posX &&
      clientX < posX + paramRect.width &&
      clientY > posY &&
      clientY < posY + paramRect.height
    ) {
      addParamByCordinatesRecursive(paramCard, card, clientX, clientY);
      break;
    }
  }
}

/**
 * Recorrer parametros para acoplar una ficha como un parametro de otra ficha a partir de coordenadas.
 */
function addParamByCordinatesRecursive(
  paramCard,
  contentCard,
  clientX,
  clientY
) {
  // Asignarle el ID a las subfichas
  for (const [i, param] of contentCard.params.entries()) {
    if (param.content) {
      addParamByCordinatesRecursive(paramCard, param.content, clientX, clientY);
    } else {
      var domRect = document
        .getElementById("mathCanvas")
        .getBoundingClientRect();
      var paramRect = document
        .getElementById("param." + contentCard.id + "." + (parseInt(i) + 1))
        .getBoundingClientRect();
      var posX = paramRect.x - domRect.x;
      var posY = paramRect.y - domRect.y;
      // Verificar si hay un parametro vacio en las coordeandas
      if (
        clientX > posX &&
        clientX < posX + paramRect.width &&
        clientY > posY &&
        clientY < posY + paramRect.height
      ) {
        if (addParam(paramCard, contentCard, i)) {
          break;
        }
      }
    }
  }
}

// Exportar lista de fichas y funciones
module.exports = {
  cards,
  addCard,
  addParam,
  removeParam,
  removeCard,
  clean,
  deleteMetadata,
  addParamByCordinates
};
