import fastCardAgent from "../../src/service_agents/fastCardAgent";

describe("Pruebas para crear fichas rápidas en el servidor: ", () => {
  it("Crear ficha rápida exitosamente", done => {
    // Buscar ficha de prueba
    fastCardAgent("2+3", (status, data) => {
      // Verificar resultado consistente
      chai.expect(data).to.deep.equal({
        title: "",
        description: "",
        params: [],
        latexCode: "5",
        pythonCode:
          'def main():\n  exp = sympify("5")\n  exp = exp.subs({})\n  return exp'
      });
      // Verificar estado de respuesta
      assert.equal(status, 200);
      done();
    });
  }).timeout(50000);

  it("Crear ficha rápida fallida", done => {
    // Buscar ficha de prueba
    fastCardAgent("/", (status, data) => {
      // Verificar resultado consistente
      assert.equal(data, "Error en la ejecución");
      // Verificar estado de respuesta
      assert.equal(status, 400);
      done();
    });
  }).timeout(50000);
});
