describe("Integracao - login, estado e roteamento do front", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
  });

  it("marca os campos com erro quando o login e invalido", function () {
    cy.visitRoute(this.profile, "login");
    cy.fillFirstVisible(this.profile.selectors.email, this.users.invalidUser.email);
    cy.fillFirstVisible(this.profile.selectors.password, this.users.invalidUser.password);
    cy.submitAuthForm(this.profile);

    cy.contains(/usuário ou senha inválidos/i).should("be.visible");
    cy.get("#email").parents("[data-invalid='true']").should("exist");
    cy.get("#password").parents("[data-invalid='true']").should("exist");
  });

  it("aceita o login valido e exibe o modal intermediario antes do dashboard", function () {
    cy.visitRoute(this.profile, "login");
    cy.fillFirstVisible(this.profile.selectors.email, this.users.validUser.email);
    cy.fillFirstVisible(this.profile.selectors.password, this.users.validUser.password);
    cy.submitAuthForm(this.profile);

    cy.contains(/seu login está incorreto, quer continuar\?/i).should("be.visible");
    cy.contains("button", /continuar/i).click();
    cy.location("pathname").should("eq", "/dashboard");
  });

  it("permite acesso direto ao dashboard sem autenticacao", function () {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains(/bancos de dados/i).should("be.visible");
    cy.get("input[type='search']").should("be.visible");
  });
});
