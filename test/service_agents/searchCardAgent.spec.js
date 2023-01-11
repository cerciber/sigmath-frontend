import searchCardAgent from "../../src/service_agents/searchCardAgent";
import saveCardAgent from "../../src/service_agents/saveCardAgent";

var cardJson1 = {
  id: 1,
  title: "textoabcdeasdsfcwsedfcwseftexto",
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

describe("Pruebas para buscar fichas en la base de datos: ", () => {
  beforeEach(done => {
    // Insertar una carta para buscar
    saveCardAgent(cardJson1, () => {
      done();
    });
  });

  it("Buscar fichas en la base de datos", done => {
    // Buscar ficha de prueba
    searchCardAgent("abcdeasdsfcwsedfcwsef", (status, data) => {
      // Verificar resultado consistente
      chai.expect(data[0]).to.deep.equal({
        ID_CARD: data[0].ID_CARD,
        title: "textoabcdeasdsfcwsedfcwseftexto",
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
      });
      // Verificar estado de respuesta
      assert.equal(status, 200);
      done();
    });
  }).timeout(50000);

  it("Buscar fichas en la base de datos con error", done => {
    // Guardar ficha de prueba
    searchCardAgent(undefined, (status, data) => {
      // Verificar estado de respuesta
      assert.equal(status, 400);
      // Verificar estado de respuesta
      assert.equal(data, 'Petición a la ruta "/card/search" erronea');
      done();
    });
  }).timeout(50000);
});
