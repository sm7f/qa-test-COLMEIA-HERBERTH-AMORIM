describe("Regressao critica - fluxos do site", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
  });

  it("carrega a tela de login com os elementos essenciais", function () {
    cy.visitRoute(this.profile, "login");
    cy.assertLoginFormVisible(this.profile);
  });

  it("permite navegar ao dashboard apos concluir o modal do login valido", function () {
    cy.login(this.users.validUser, this.profile);
    cy.contains("button", /continuar/i).click();
    cy.location("pathname").should("eq", "/dashboard");
    cy.contains(/colmeia/i).should("be.visible");
  });

  it("abre a pagina de bancos de dados", function () {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains(/bancos de dados/i).should("be.visible");
    cy.contains("button", /criar/i).should("be.visible");
  });

  it("mostra a area de easter eggs quando acessada diretamente", function () {
    cy.visit("/easter-eggs");
    cy.contains(/easter eggs/i).should("be.visible");
    cy.contains(/colmeia forms/i).should("be.visible");
  });
});

