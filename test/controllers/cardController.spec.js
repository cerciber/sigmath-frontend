import cardController from "../../src/controllers/cardController";

var cardJson1 = {
  id: 1,
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
  id: 2,
  title: "Integral indefinida",
  description: "Integral indefinida de una expresión matemática",
  params: [
    {
      symbol: "f(x)",
      description: "Expresión matemática",
      content: cardJson1
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

var cardJson3 = {
  id: 2,
  title: "Integral indefinida",
  description: "Integral indefinida de una expresión matemática",
  params: [],
  latexCode: "",
  pythonCode: "def main():\n  return null",
  bounds: {
    x: 60,
    y: 60
  }
};

describe("Pruebas para el controlador de fichas matemáticas: ", () => {
  it("Renderizar una ficha matemática con parametros vacios", () => {
    // Renderizar ficha de prueba
    var renderedLaTeX = cardController.getRenderLaTeX(cardJson1);
    // Verificar resultado consistente
    assert.equal(
      renderedLaTeX,
      "\\sin{\\left({\\htmlClass{emptyParam}{\\htmlId{param.1.1}{x}}}\\right)}"
    );
  });

  it("Renderizar una ficha matemática con parametros asignados", () => {
    // Renderizar ficha de prueba
    var renderedLaTeX = cardController.getRenderLaTeX(cardJson2);
    // Verificar resultado consistente
    assert.equal(
      renderedLaTeX,
      "\\int {\\htmlClass{fillParam}{\\htmlId{param.2.1}{\\sin{\\left({\\htmlClass{emptyParam}{\\htmlId{param.1.1}{x}}}\\right)}}}}\\ d{\\htmlClass{emptyParam}{\\htmlId{param.2.2}{x}}}"
    );
  });

  it("Renderizar una ficha matemática con LaTeX vacio", () => {
    // Renderizar ficha de prueba
    var renderedLaTeX = cardController.getRenderLaTeX(cardJson3);
    // Verificar resultado consistente
    assert.equal(renderedLaTeX, "null");
  });
});
