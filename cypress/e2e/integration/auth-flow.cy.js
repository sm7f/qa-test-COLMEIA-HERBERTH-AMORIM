const hasConfiguredBaseUrl = () => {
  const baseUrl = Cypress.config("baseUrl");
  return Boolean(baseUrl && !baseUrl.includes("example.invalid"));
};

const describeWhenReady = hasConfiguredBaseUrl() ? describe : describe.skip;

const normalizeBody = (body) => {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      const params = new URLSearchParams(body);
      const parsed = Object.fromEntries(params.entries());

      if (Object.keys(parsed).length > 0) {
        return parsed;
      }

      return { raw: body };
    }
  }

  return body;
};

const isAuthPayload = (body) => {
  const normalized = normalizeBody(body);
  const userKey = ["email", "username", "login"].find((key) => key in normalized);
  return Boolean(userKey && "password" in normalized);
};

const installAuthInterceptor = (handler) => {
  cy.intercept("POST", "**", (req) => {
    const requestBody = normalizeBody(req.body);

    if (!isAuthPayload(requestBody)) {
      req.continue();
      return;
    }

    req.alias = "authRequest";
    handler(req, requestBody);
  });
};

describeWhenReady("Integracao - autenticacao controlada", () => {
  beforeEach(function () {
    cy.fixture("users").as("users");
    cy.fixture("site-profile").as("profile");
    cy.fixture("api-responses").as("apiResponses");
  });

  it("envia o payload esperado ao submeter o login", function () {
    installAuthInterceptor((req) => {
      req.reply(this.apiResponses.unauthorized);
    });

    cy.login(this.users.validUser, this.profile);

    cy.wait("@authRequest").then(({ request }) => {
      const body = normalizeBody(request.body);
      const identity = body.email || body.username || body.login;

      expect(identity).to.equal(this.users.validUser.email);
      expect(body.password).to.equal(this.users.validUser.password);
    });
  });

  it("mantem o usuario no contexto de autenticacao quando recebe 401", function () {
    installAuthInterceptor((req) => {
      req.reply(this.apiResponses.unauthorized);
    });

    cy.login(this.users.invalidUser, this.profile);
    cy.wait("@authRequest");
    cy.assertAuthError(this.profile);
  });

  it("nao quebra a tela quando o backend fica indisponivel", function () {
    installAuthInterceptor((req) => {
      req.reply({ forceNetworkError: true });
    });

    cy.login(this.users.validUser, this.profile);
    cy.wait("@authRequest");
    cy.assertAuthError(this.profile);
  });
});
