const createDatabaseItem = (name) => {
  cy.contains("button", /criar/i).click();
  cy.get("input[placeholder='Nome do item']").type(name);
  cy.contains("button", /salvar/i).click();
};

describe("Evidencias visuais - cenarios derivados do Easter Eggs", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
    cy.viewport(1440, 1200);
  });

  it("captura link de esqueci minha senha sem acao util", function () {
    cy.visitRoute(this.profile, "login");
    cy.contains("a", /esqueceu sua senha\?/i)
      .should("be.visible")
      .and("not.have.attr", "href");
    cy.screenshot("login-esqueceu-senha-sem-acao", { capture: "fullPage" });
  });

  it("captura login valido com modal contraditorio", function () {
    cy.visitRoute(this.profile, "login");
    cy.fillFirstVisible(this.profile.selectors.email, this.users.validUser.email);
    cy.fillFirstVisible(this.profile.selectors.password, this.users.validUser.password);
    cy.submitAuthForm(this.profile);
    cy.contains(/seu login está incorreto, quer continuar\?/i).should("be.visible");
    cy.screenshot("login-valido-modal-contraditorio-easter-eggs", { capture: "fullPage" });
  });

  it("captura clique na lupa sem filtrar a lista", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Alpha");
    createDatabaseItem("Beta");
    cy.get("input[type='search']").invoke("val", "Alpha");
    cy.get("input[type='search']").siblings("button[type='button']").click();
    cy.contains("tbody tr", "Alpha").should("be.visible");
    cy.contains("tbody tr", "Beta").should("be.visible");
    cy.screenshot("bancos-lupa-nao-filtra", { capture: "fullPage" });
  });

  it("captura ausencia do estado vazio apos excluir todos os itens", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Unico item");
    cy.contains("tr", "Unico item").within(() => {
      cy.get("button[title='Apagar']").click();
    });
    cy.contains(/nenhum banco de dados encontrado/i).should("not.exist");
    cy.screenshot("bancos-estado-vazio-nao-retorna", { capture: "fullPage" });
  });

  it("captura refresh apagando os itens da lista", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Item persistente");
    cy.contains("tr", "Item persistente").should("be.visible");
    cy.contains("button", /criar/i).prev("button").click();
    cy.contains("tr", "Item persistente").should("not.exist");
    cy.screenshot("bancos-refresh-apaga-lista", { capture: "fullPage" });
  });

  it("captura arquivar agindo como apagar", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    createDatabaseItem("Item arquivavel");
    cy.contains("tr", "Item arquivavel").within(() => {
      cy.get("button[title='Arquivar']").click();
    });
    cy.contains("tr", "Item arquivavel").should("not.exist");
    cy.get("button").eq(0).click({ force: true });
    cy.screenshot("bancos-arquivar-age-como-apagar", { capture: "fullPage" });
  });

  it("captura persistencia de item em branco apos insistencia", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains("button", /criar/i).click();
    cy.contains("button", /salvar/i).click();
    cy.contains(/o nome do item é obrigatório/i).should("be.visible");
    cy.contains("button", /salvar/i).click();
    cy.contains("tbody tr td", /^$/).should("exist");
    cy.screenshot("bancos-item-em-branco-persistido", { capture: "fullPage" });
  });

  it("captura rota Colmeia Forms em branco", () => {
    cy.visit("/dashboard/campanha/colmeia-forms");
    cy.get("ng-component.w-full.h-full.flex.gap-4.px-2.py-4 > ng-component")
      .last()
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("");
      });
    cy.screenshot("colmeia-forms-pagina-em-branco", { capture: "fullPage" });
  });
});
