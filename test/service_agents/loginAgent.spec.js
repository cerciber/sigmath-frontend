import signupAgent from "../../src/service_agents/signupAgent";
import loginAgent from "../../src/service_agents/loginAgent";

describe("Pruebas para iniciar sesión en el servidor: ", () => {
  beforeEach(done => {
    // Registrar un usuario
    signupAgent(
      {
        nickname: "clientUser2",
        email: "clientUser2@hotmail.com",
        password: "123456789"
      },
      () => {
        done();
      }
    );
  });

  it("Iniciar sesión exitosamente", done => {
    loginAgent(
      {
        email: "clientUser2@hotmail.com",
        password: "123456789"
      },
      (status, data) => {
        // Verificar resultado consistente
        chai.expect(data).to.deep.equal({
          ID_USER: data.ID_USER,
          nickname: "clientUser2",
          email: "clientUser2@hotmail.com",
          password: "123456789"
        });
        // Verificar estado de respuesta
        assert.equal(status, 200);
        done();
      }
    );
  }).timeout(50000);

  it("Iniciar sesión sin exito", done => {
    // Buscar ficha de prueba
    loginAgent({}, (status, data) => {
      // Verificar estado de respuesta
      assert.equal(status, 400);
      done();
    });
  }).timeout(50000);
});
