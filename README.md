# Suite Cypress - Teste Tecnico QA

Este diretorio agora contem uma base Cypress para o teste tecnico descrito em [siteteste.md](./siteteste.md), orientada pelos criterios de [agt-cypress.md](./agt-cypress.md) e pelos sinais de falha observavel derivados de [agt-cybersecurity.md](./agt-cybersecurity.md).

## O que foi entregue

- estrutura Cypress para testes de integracao e regressao
- fixtures para credenciais, respostas simuladas e perfil do site
- comandos customizados para login parametrizado
- documentacao com estrategia, cenarios e matriz de testes

## Estrutura

```txt
cypress/
  component/
    README.md
  e2e/
    integration/
      auth-flow.cy.js
    regression/
      smoke-login.cy.js
  fixtures/
    api-responses.json
    site-profile.json
    users.json
  support/
    commands.js
    e2e.js
docs/
  estrategia-e-cenarios.md
```

## Como instalar

Este ambiente nao possui `node` nem `npm` instalados no PATH, entao a instalacao nao foi executada localmente. Quando o runtime Node estiver disponivel:

```bash
npm install cypress --save-dev
```

## Como configurar a aplicacao alvo

1. Informe a URL da aplicacao via variavel de ambiente:

```bash
export CYPRESS_baseUrl="https://url-do-site-alvo"
```

2. Ajuste [cypress/fixtures/site-profile.json](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/cypress/fixtures/site-profile.json:1) se os seletores ou a rota de login forem diferentes do padrao.

## Como executar

```bash
npx cypress open
npx cypress run
npm run test:integration
npm run test:regression
```

## Limites atuais

- A URL da aplicacao alvo nao foi fornecida nos insumos.
- O codigo-fonte da aplicacao nao esta neste repositorio, entao os testes unitarios com Cypress Component Testing ficaram documentados, mas nao implementados.
- Os testes de integracao usam mocks genericos de autenticacao. Se o contrato real da API for diferente, ajuste os payloads em [cypress/fixtures/api-responses.json](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/cypress/fixtures/api-responses.json:1).

