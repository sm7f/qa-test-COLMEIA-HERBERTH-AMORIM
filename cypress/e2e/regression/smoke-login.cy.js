const hasConfiguredBaseUrl = () => {
  const baseUrl = Cypress.config("baseUrl");
  return Boolean(baseUrl && !baseUrl.includes("example.invalid"));
};

const describeWhenReady = hasConfiguredBaseUrl() ? describe : describe.skip;

describeWhenReady("Regressao critica - login", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
  });

  it("carrega a tela de autenticacao com os elementos essenciais", function () {
    cy.visitRoute(this.profile, "login");
    cy.assertLoginFormVisible(this.profile);
  });

  it("continua rejeitando credenciais invalidas", function () {
    cy.login(this.users.invalidUser, this.profile);
    cy.assertAuthError(this.profile);
  });

  it("continua permitindo autenticacao com credenciais validas", function () {
    cy.login(this.users.validUser, this.profile);
    cy.assertLoggedIn(this.profile);
  });
});
