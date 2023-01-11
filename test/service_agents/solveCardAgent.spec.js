import solveCardAgent from "../../src/service_agents/solveCardAgent";

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

describe("Pruebas para resolver una ficha en el servidor: ", () => {
  it("Resolver ficha en el servidor", done => {
    // Guardar ficha de prueba
    solveCardAgent(cardJson2, (status, data) => {
      // Verificar resultado consistente
      chai.expect(data).to.deep.equal({
        title: "",
        description: "",
        params: [{ symbol: "x", description: "", content: null }],
        latexCode: "- \\cos{\\left(#1 \\right)}",
        pythonCode:
          "def main(x):\n  exp = sympify(\"-cos(x)\")\n  exp = exp.subs({'x': x, })\n  return exp"
      });
      // Verificar estado de respuesta
      assert.equal(status, 200);
      done();
    });
  }).timeout(50000);

  it("Resolver ficha en el servidor con error", done => {
    // Guardar ficha de prueba
    solveCardAgent(undefined, (status, data) => {
      // Verificar estado de respuesta
      assert.equal(status, 400);
      // Verificar estado de respuesta
      assert.equal(data, 'Petición a la ruta "/card/solve" erronea');
      done();
    });
  }).timeout(50000);
});
