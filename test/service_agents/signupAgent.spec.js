import signupAgent from "../../src/service_agents/signupAgent";

describe("Pruebas para registrarse en el servidor: ", () => {
  it("Registrarse exitosamente", done => {
    // Buscar ficha de prueba
    signupAgent(
      {
        nickname: "clientUser1",
        email: "clientUser1@hotmail.com",
        password: "123456789"
      },
      (status, data) => {
        // Verificar resultado consistente
        chai.expect(data).to.deep.equal({
          ID_USER: data.ID_USER,
          nickname: "clientUser1",
          email: "clientUser1@hotmail.com",
          password: "123456789"
        });
        // Verificar estado de respuesta
        assert.equal(status, 201);
        done();
      }
    );
  }).timeout(50000);

  it("Registrarse sin exito", done => {
    // Buscar ficha de prueba
    signupAgent({}, (status, data) => {
      // Verificar estado de respuesta
      assert.equal(status, 400);
      done();
    });
  }).timeout(50000);
});
