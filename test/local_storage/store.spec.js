import { mutations } from "../../src/local_storage/temporalStore";

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

// Estados del sistema
const state = {
  mathpad: {
    fileName: "",
    selectedCard: null,
    draggedCard: null,
    programingCard: null,
    results: [],
    resultsState: "initial",
    programCard: false,
    newProgrammingCardScheme: {
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
      pythonCode: "def main(f_x, x):\n  return integrate(f_x, Symbol(x))"
    },
    newProgrammingCardParameterScheme: {
      symbol: "x",
      description: "Parametro x",
      content: null
    }
  }
};

describe("Pruebas para el entorno global de Vuex: ", () => {
  it("Asignar nombre de archivo del MathPad", () => {
    // Asignar nombre
    mutations.setMathpadFileName(state, { fileName: "Nombre del archivo" });
    // Verificar cambio
    assert.equal(state.mathpad.fileName, "Nombre del archivo");
  });

  it("Asignar carta seleccionada del MathPad", () => {
    // Asignar ficha seleccionada
    mutations.setMathpadSelectedCard(state, {
      selectedCard: cardJson1
    });
    // Verificar cambio
    assert.equal(state.mathpad.selectedCard, cardJson1);
  });

  it("Asignar carta arrastrada del MathPad", () => {
    // Asignar ficha arrastrada
    mutations.setMathpadDraggedCard(state, {
      draggedCard: cardJson1
    });
    // Verificar cambio
    assert.equal(state.mathpad.draggedCard, cardJson1);
  });

  it("Asignar resultado de la busqueda del MathPad", () => {
    // Asignar resultados
    mutations.setMathpadResults(state, {
      results: [cardJson1]
    });
    // Verificar cambio
    chai.expect(state.mathpad.results).to.deep.equal([cardJson1]);
  });

  it("Mostrar resultados", () => {
    // Asignar resultados
    mutations.showResults(state);
    // Verificar cambio
    assert.equal(state.mathpad.resultsState, "show");
  });

  it("Ocultar resultados", () => {
    // Asignar resultados
    mutations.hideResults(state);
    // Verificar cambio
    assert.equal(state.mathpad.resultsState, "hide");
  });

  it("Asignar que se está programando una ficha", () => {
    // Asignar resultados
    mutations.setMathpadProgramCard(state);
    // Verificar cambio
    assert.equal(state.mathpad.programCard, true);
  });

  it("Asignar que no se esta programando una ficha", () => {
    // Asignar resultados
    mutations.setMathpadNoProgramCard(state);
    // Verificar cambio
    assert.equal(state.mathpad.programCard, false);
    assert.equal(state.mathpad.programingCard, null);
  });

  it("Asignar nueva ficha para programar", () => {
    // Asignar resultados
    mutations.setNewProgrammigCard(state);
  });
});
