import saveCardAgent from "../../src/service_agents/saveCardAgent";

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

describe("Pruebas para guardar una ficha en la base de datos: ", () => {
  it("Guardar ficha en la base de datos", done => {
    // Guardar ficha de prueba
    saveCardAgent(cardJson2, (status, data) => {
      // Verificar resultado consistente
      chai.expect(data).to.deep.equal({
        ID_CARD: data.ID_CARD,
        title: "Integral indefinida",
        description: "Integral indefinida de una expresión matemática",
        params: [
          {
            symbol: "f(x)",
            content: {
              id: 1,
              title: "Seno",
              params: [
                { symbol: "x", content: null, description: "Variable del seno" }
              ],
              latexCode: "\\sin{\\left({#1}\\right)}",
              pythonCode: "def main(x):\n  return sin(x)",
              description: "Seno trigonométrico"
            },
            description: "Expresión matemática"
          },
          {
            symbol: "x",
            content: null,
            description: "Símbolo sobre el cual se realiza la integración"
          }
        ],
        latexCode: "\\int {#1}\\ d{#2}",
        pythonCode: "def main(f_x, x):\n  return integrate(f_x, Symbol(x))"
      });
      done();
    });
  }).timeout(50000);

  it("Guardar ficha en la base de datos con error", done => {
    // Guardar ficha de prueba
    saveCardAgent(undefined, (status, data) => {
      // Verificar estado de respuesta
      assert.equal(status, 400);
      // Verificar estado de respuesta
      assert.equal(data, 'Petición a la ruta "/card/insert" erronea');
      done();
    });
  }).timeout(50000);
});
