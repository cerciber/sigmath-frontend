import canvasController from "../../src/controllers/canvasController";

var cardJson1 = {
  title: "Seno",
  description: "Seno trigonométrico",
  params: [
    {
      symbol: "x",
      description: "Variable del seno",
      content: null
    }
  ],
  latexCode: "\\sin{\\left({#1}\\right)}",
  pythonCode: "def main(x):\n  return sin(x)"
};

var cardJson2 = {
  title: "Integral indefinida",
  description: "Integral indefinida de una expresión matemática",
  params: [
    {
      symbol: "f(x)",
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
  pythonCode: "def main(f_x, x):\n  return integrate(f_x, Symbol(x))",
  bounds: {
    x: 60,
    y: 60
  }
};

describe("Pruebas para el controlador del lienzo matemático: ", () => {
  it("Añadir una nueva ficha sin coordenadas al lienzo", () => {
    // Añadir la ficha
    var addedCard = canvasController.addCard(cardJson1);

    // Verificar resultado consistente
    chai.expect(addedCard).to.deep.equal({
      title: "Seno",
      description: "Seno trigonométrico",
      params: [
        { symbol: "x", description: "Variable del seno", content: null }
      ],
      latexCode: "\\sin{\\left({#1}\\right)}",
      pythonCode: "def main(x):\n  return sin(x)",
      id: 1,
      bounds: { x: 5, y: 5 }
    });

    // Verificar que la ficha se añadió en la lista
    chai.expect(canvasController.cards[0]).to.deep.equal({
      title: "Seno",
      description: "Seno trigonométrico",
      params: [
        { symbol: "x", description: "Variable del seno", content: null }
      ],
      latexCode: "\\sin{\\left({#1}\\right)}",
      pythonCode: "def main(x):\n  return sin(x)",
      id: 1,
      bounds: { x: 5, y: 5 }
    });
  });

  it("Añadir una nueva ficha con coordenadas al lienzo", () => {
    // Añadir la ficha
    var addedCard = canvasController.addCard(cardJson2);

    // Verificar resultado consistente
    chai.expect(addedCard).to.deep.equal({
      title: "Integral indefinida",
      description: "Integral indefinida de una expresión matemática",
      params: [
        {
          symbol: "f(x)",
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
      pythonCode: "def main(f_x, x):\n  return integrate(f_x, Symbol(x))",
      bounds: { x: 60, y: 60 },
      id: 2
    });

    // Verificar que la ficha se añadió en la lista
    chai.expect(addedCard).to.deep.equal({
      title: "Integral indefinida",
      description: "Integral indefinida de una expresión matemática",
      params: [
        {
          symbol: "f(x)",
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
      pythonCode: "def main(f_x, x):\n  return integrate(f_x, Symbol(x))",
      bounds: { x: 60, y: 60 },
      id: 2
    });
  });

  it("Intentar acoplar una ficha en un parámetro libre de otra", () => {
    // Añadir el parametro
    var result = canvasController.addParam(cardJson1, cardJson2, 0);

    // Verificar resultado consistente
    assert.equal(result, true);

    // Verificar el Json resultante
    chai.expect(cardJson2).to.deep.equal({
      title: "Integral indefinida",
      description: "Integral indefinida de una expresión matemática",
      params: [
        {
          symbol: "f(x)",
          description: "Expresión matemática",
          content: {
            title: "Seno",
            description: "Seno trigonométrico",
            params: [
              { symbol: "x", description: "Variable del seno", content: null }
            ],
            latexCode: "\\sin{\\left({#1}\\right)}",
            pythonCode: "def main(x):\n  return sin(x)"
          }
        },
        {
          symbol: "x",
          description: "Símbolo sobre el cual se realiza la integración",
          content: null
        }
      ],
      latexCode: "\\int {#1}\\ d{#2}",
      pythonCode: "def main(f_x, x):\n  return integrate(f_x, Symbol(x))",
      bounds: { x: 60, y: 60 }
    });
  });

  it("Intentar acoplar una ficha en un parámetro lleno de otra", () => {
    // Añadir el parametro
    var result = canvasController.addParam(cardJson1, cardJson2, 0);

    // Verificar resultado consistente
    assert.equal(result, false);
  });

  it("Intentar desacoplar una ficha en un parámetro lleno de otra", () => {
    // Remover el parametro
    var result = canvasController.removeParam(cardJson2, 0);

    // Verificar resultado consistente
    assert.equal(result, true);
  });

  it("Intentar desacoplar una ficha en un parámetro vacio de otra", () => {
    // Remover el parametro
    var result = canvasController.removeParam(cardJson2, 0);

    // Verificar resultado consistente
    assert.equal(result, false);
  });

  it("Remover una ficha del lienzo", () => {
    // Remover ficha
    canvasController.removeCard(cardJson2);

    // Verificar que la ficha ya no se encuentra en la lista
    assert.equal(canvasController.cards.indexOf(cardJson2), -1);
  });
});
