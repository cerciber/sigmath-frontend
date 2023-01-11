/**
 * Controlador que se encarga realizar las opraciones de manipulación de las fichas por defecto.
 *
 * @module controllers-default-card
 * @author Labeleon <labeleon@gmail.com>
 */

// Modulos creados
const defaultCards = require("../local_storage/defaultCards.json");

/**
 * Obtener ficha por defecto por ID.
 *
 * @param {integer} ID_CARD - ID de la ficha por defecto.
 * @returns {card} - Ficha por defecto encontrada
 */
function getDefaultCard(ID_CARD) {
  for (category of defaultCards) {
    for (card of category.content) {
      if (card.ID_CARD == ID_CARD) {
        return JSON.parse(JSON.stringify(card));
      }
    }
  }
}

/**
 * Envolver una ficha bajo un solucionador.
 *
 * @param {json} card - Ficha a ser envuelta en un solucionador.
 * @param {integer} ID_CARD - ID del solucuionador.
 * @returns {cardContent} - Ficha resultante.
 */
function coverCard(card, ID_CARD) {
  card = JSON.parse(JSON.stringify(card));
  const cardContent = getDefaultCard(ID_CARD);
  cardContent.params[0].content = card;
  return cardContent;
}

// Exportar funciones
module.exports = {
  getDefaultCard,
  coverCard
};
