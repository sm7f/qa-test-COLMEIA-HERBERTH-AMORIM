const createDatabaseItem = (name) => {
  cy.contains("button", /criar/i).click();
  cy.get("input[placeholder='Nome do item']").type(name);
  cy.contains("button", /salvar/i).click();
};

const databaseContentRoot = () =>
  cy.get("ng-component.w-full.h-full.flex.gap-4.px-2.py-4 > ng-component").last();

describe("Regressão principal - cenários derivados do Easter Eggs", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
  });

  it("login - botao de esqueci minha senha deveria ser navegavel ou acionavel", function () {
    cy.visitRoute(this.profile, "login");
    cy.contains("a", /esqueceu sua senha\?/i)
      .should("have.attr", "href")
      .and("not.be.empty");
  });

  it("login - login valido nao deveria mostrar mensagem contraditoria", function () {
    cy.visitRoute(this.profile, "login");
    cy.fillFirstVisible(this.profile.selectors.email, this.users.validUser.email);
    cy.fillFirstVisible(this.profile.selectors.password, this.users.validUser.password);
    cy.submitAuthForm(this.profile);

    cy.contains(/seu login está incorreto, quer continuar\?/i).should("not.exist");
    cy.location("pathname").should("eq", "/dashboard");
  });

  it("banco de dados - botao de lupa deveria executar a busca", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Alpha");
    createDatabaseItem("Beta");

    cy.get("input[type='search']").invoke("val", "Alpha");
    cy.get("input[type='search']").siblings("button[type='button']").click();

    cy.contains("tbody tr", "Alpha").should("be.visible");
    cy.contains("tbody tr", "Beta").should("not.exist");
  });

  it("banco de dados - ao remover todos os itens deveria reaparecer o estado vazio", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Unico item");

    cy.contains("tr", "Unico item").within(() => {
      cy.get("button[title='Apagar']").click();
    });

    cy.contains(/nenhum banco de dados encontrado/i).should("be.visible");
  });

  it("banco de dados - refresh nao deveria apagar os itens da lista", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Item persistente");
    cy.contains("tr", "Item persistente").should("be.visible");

    cy.contains("button", /criar/i).prev("button").click();

    cy.contains("tr", "Item persistente").should("be.visible");
  });

  it("banco de dados - arquivar deveria ter comportamento diferente de apagar", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Item arquivavel");

    cy.contains("tr", "Item arquivavel").within(() => {
      cy.get("button[title='Arquivar']").click();
    });

    cy.get("button").eq(0).click({ force: true });
    cy.contains(/itens arquivados/i).should("be.visible");
    cy.contains("tr", "Item arquivavel").should("be.visible");
  });

  it("banco de dados - nao deveria permitir incluir item em branco apos insistencia", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains("button", /criar/i).click();
    cy.contains("button", /salvar/i).click();
    cy.contains(/o nome do item é obrigatório/i).should("be.visible");
    cy.contains("button", /salvar/i).click();
    cy.contains("tbody tr td", /^$/).should("not.exist");
  });

  it("colmeia forms - a pagina deveria renderizar conteudo funcional", () => {
    cy.visit("/dashboard/campanha/colmeia-forms");

    databaseContentRoot()
      .find("input, textarea, button, form, table, h1, h2, h3, p")
      .its("length")
      .should("be.greaterThan", 0);
  });
});
