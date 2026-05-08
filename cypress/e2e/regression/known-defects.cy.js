describe("Regressão complementar - achados fora do Easter Eggs", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
  });

  it("deveria redirecionar o usuario nao autenticado para o login ao acessar o dashboard", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.location("pathname").should("eq", "/");
  });

  it("nao deveria expor a pagina interna de Easter Eggs publicamente", () => {
    cy.visit("/easter-eggs");
    cy.location("pathname").should("eq", "/");
  });
});
