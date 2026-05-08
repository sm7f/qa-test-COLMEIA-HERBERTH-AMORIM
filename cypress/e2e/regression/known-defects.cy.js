describe("Regressao - cenarios que evidenciam falhas", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
  });

  it("deveria redirecionar o usuario nao autenticado para o login ao acessar o dashboard", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.location("pathname").should("eq", "/");
  });

  it("deveria concluir o login valido sem mensagem contraditoria de erro", function () {
    cy.visitRoute(this.profile, "login");
    cy.fillFirstVisible(this.profile.selectors.email, this.users.validUser.email);
    cy.fillFirstVisible(this.profile.selectors.password, this.users.validUser.password);
    cy.submitAuthForm(this.profile);

    cy.contains(/seu login está incorreto, quer continuar\?/i).should("not.exist");
    cy.location("pathname").should("eq", "/dashboard");
  });

  it("deveria renderizar conteudo na pagina Colmeia Forms", () => {
    cy.visit("/dashboard/campanha/colmeia-forms");
    cy.get("body").invoke("text").then((text) => {
      expect(text.replace(/\s+/g, "").length, "conteudo visivel").to.be.greaterThan(20);
    });
  });

  it("deveria arquivar o item sem remove-lo da experiencia do usuario", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains("button", /criar/i).click();
    cy.get("input[placeholder='Nome do item']").type("Item arquivavel");
    cy.contains("button", /salvar/i).click();

    cy.contains("tr", "Item arquivavel").within(() => {
      cy.get("button[title='Arquivar']").click();
    });

    cy.get("button").eq(0).click({ force: true });
    cy.contains(/itens arquivados/i).should("be.visible");
    cy.contains("tr", "Item arquivavel").should("be.visible");
  });

  it("nao deveria permitir incluir item em branco mesmo apos tentativas repetidas", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains("button", /criar/i).click();
    cy.contains("button", /salvar/i).click();
    cy.contains(/o nome do item é obrigatório/i).should("be.visible");
    cy.contains("button", /salvar/i).click();
    cy.contains("tbody tr td", /^$/).should("not.exist");
  });

  it("deveria voltar a exibir a mensagem de lista vazia apos remover todos os itens", () => {
    cy.visit("/dashboard/campanha/bancos-de-dados");
    cy.contains("button", /criar/i).click();
    cy.get("input[placeholder='Nome do item']").type("Unico item");
    cy.contains("button", /salvar/i).click();

    cy.contains("tr", "Unico item").within(() => {
      cy.get("button[title='Apagar']").click();
    });

    cy.contains(/nenhum banco de dados encontrado/i).should("be.visible");
  });
});
