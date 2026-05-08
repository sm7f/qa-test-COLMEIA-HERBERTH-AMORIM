describe("Evidencias visuais - achados principais", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
    cy.viewport(1440, 900);
  });

  it("captura acesso direto ao dashboard sem autenticacao", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains(/bancos de dados/i).should("be.visible");
    cy.get("input[type='search']").should("be.visible");
    cy.screenshot("dashboard-sem-autenticacao");
  });

  it("captura modal contraditorio apos login valido", function () {
    cy.visitRoute(this.profile, "login");
    cy.fillFirstVisible(this.profile.selectors.email, this.users.validUser.email);
    cy.fillFirstVisible(this.profile.selectors.password, this.users.validUser.password);
    cy.submitAuthForm(this.profile);
    cy.contains(/seu login está incorreto, quer continuar\?/i).should("be.visible");
    cy.screenshot("login-valido-modal-contraditorio");
  });

  it("captura rota publica de easter eggs", () => {
    cy.visit("/easter-eggs");
    cy.contains(/easter eggs/i).should("be.visible");
    cy.contains(/colmeia forms/i).should("be.visible");
    cy.screenshot("rota-publica-easter-eggs");
  });

  it("captura persistencia de item em branco apos tentativas repetidas", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains("button", /criar/i).click();
    cy.contains("button", /salvar/i).click();
    cy.contains(/o nome do item é obrigatório/i).should("be.visible");
    cy.contains("button", /salvar/i).click();
    cy.contains("tbody tr td", /^$/).should("exist");
    cy.screenshot("item-em-branco-persistido");
  });
});
