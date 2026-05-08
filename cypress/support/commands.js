const toArray = (value) => (Array.isArray(value) ? value : [value]).filter(Boolean);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildTextPattern = (values) =>
  new RegExp(toArray(values).map(escapeRegExp).join("|"), "i");

const firstSelectorFound = ($body, selectors) =>
  toArray(selectors).find((selector) => $body.find(selector).length > 0);

const firstVisibleElement = ($body, selectors) => {
  const selector = firstSelectorFound($body, selectors);

  if (!selector) {
    return null;
  }

  return {
    selector,
    visible: $body.find(selector).filter(":visible").length > 0
  };
};

Cypress.Commands.add("visitRoute", (profile, routeKey) => {
  const route = profile.routes?.[routeKey];
  cy.visit(route || routeKey);
});

Cypress.Commands.add("fillFirstVisible", (selectors, value) => {
  cy.get("body").then(($body) => {
    const resolved = firstVisibleElement($body, selectors);

    if (!resolved || !resolved.visible) {
      throw new Error(`Nenhum campo visivel encontrado para: ${toArray(selectors).join(", ")}`);
    }

    cy.get(resolved.selector).filter(":visible").first().clear().type(value);
  });
});

Cypress.Commands.add("clickFirstVisible", (selectors) => {
  cy.get("body").then(($body) => {
    const resolved = firstVisibleElement($body, selectors);

    if (!resolved || !resolved.visible) {
      throw new Error(`Nenhum acionador visivel encontrado para: ${toArray(selectors).join(", ")}`);
    }

    cy.get(resolved.selector).filter(":visible").first().click();
  });
});

Cypress.Commands.add("submitAuthForm", (profile) => {
  cy.get("body").then(($body) => {
    const resolved = firstVisibleElement($body, profile.selectors.submit);

    if (resolved && resolved.visible) {
      cy.get(resolved.selector).filter(":visible").first().click();
      return;
    }

    cy.contains(
      "button, [role='button'], a",
      buildTextPattern(["entrar", "login", "acessar", "continuar"])
    ).click();
  });
});

Cypress.Commands.add("login", (credentials, profile) => {
  cy.visitRoute(profile, "login");
  cy.fillFirstVisible(profile.selectors.email, credentials.email);
  cy.fillFirstVisible(profile.selectors.password, credentials.password);
  cy.submitAuthForm(profile);
});

Cypress.Commands.add("assertLoginFormVisible", (profile) => {
  cy.get("body").then(($body) => {
    const emailField = firstVisibleElement($body, profile.selectors.email);
    const passwordField = firstVisibleElement($body, profile.selectors.password);
    const submitButton = firstVisibleElement($body, profile.selectors.submit);

    expect(emailField, "campo de email mapeado").to.not.equal(null);
    expect(passwordField, "campo de senha mapeado").to.not.equal(null);
    expect(submitButton, "botao de submit mapeado").to.not.equal(null);
    expect(emailField.visible, "campo de email visivel").to.equal(true);
    expect(passwordField.visible, "campo de senha visivel").to.equal(true);
    expect(submitButton.visible, "botao de submit visivel").to.equal(true);

    if (toArray(profile.content?.loginHeading).length > 0) {
      const bodyText = $body.text().toLowerCase();
      const hasHeading = toArray(profile.content.loginHeading).some((value) =>
        bodyText.includes(value.toLowerCase())
      );

      if (hasHeading) {
        cy.contains(buildTextPattern(profile.content.loginHeading)).should("be.visible");
      }
    }
  });
});

Cypress.Commands.add("assertAuthError", (profile) => {
  cy.get("body").then(($body) => {
    const bodyText = $body.text().toLowerCase();
    const errorIndicators = toArray(profile.content?.errorIndicators);
    const hasErrorIndicator = errorIndicators.some((value) =>
      bodyText.includes(value.toLowerCase())
    );

    if (hasErrorIndicator) {
      cy.contains(buildTextPattern(errorIndicators)).should("be.visible");
      return;
    }

    const passwordField = firstVisibleElement($body, profile.selectors.password);
    expect(passwordField && passwordField.visible, "formulario permanece disponivel apos falha").to.equal(true);
  });
});

Cypress.Commands.add("assertLoggedIn", (profile) => {
  cy.get("body").then(($body) => {
    const postLoginPattern = profile.routes?.postLoginPattern;

    if (postLoginPattern) {
      cy.location("pathname").should("match", new RegExp(escapeRegExp(postLoginPattern), "i"));
    }

    const bodyText = $body.text().toLowerCase();
    const successIndicators = toArray(profile.content?.successIndicators);
    const hasSuccessIndicator = successIndicators.some((value) =>
      bodyText.includes(value.toLowerCase())
    );

    if (hasSuccessIndicator) {
      cy.contains(buildTextPattern(successIndicators)).should("be.visible");
      return;
    }

    const passwordField = firstVisibleElement($body, profile.selectors.password);
    expect(passwordField && passwordField.visible, "formulario de login nao deve seguir visivel apos sucesso").to.equal(false);
  });
});

