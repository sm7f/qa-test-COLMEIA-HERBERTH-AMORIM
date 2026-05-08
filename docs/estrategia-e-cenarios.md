# Estrategia e Cenarios de Teste

## Insumos analisados

- [agt-cypress.md](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/agt-cypress.md:1)
- [agt-cybersecurity.md](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/agt-cybersecurity.md:1)
- [siteteste.md](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/siteteste.md:1)

## Diagnostico inicial

- O diretorio nao contem o codigo-fonte da aplicacao alvo.
- A URL do site sob teste nao aparece em nenhum dos insumos.
- Ha credenciais validas de acesso:
  - email: `qa@test.com`
  - senha: `123456`
- O escopo pedido limita a automacao a:
  - testes unitarios
  - testes de integracao
  - testes de regressao

## Suposicoes tecnicas

> Suposicao tecnica: a aplicacao possui um fluxo de autenticacao com campos de email e senha, porque as credenciais foram fornecidas como principal massa de teste.

> Suposicao tecnica: a automacao deve ser executada contra uma URL externa, por isso a suite usa `CYPRESS_baseUrl`.

> Suposicao tecnica: os seletores reais do site podem variar; por isso a suite centraliza esse mapeamento em `cypress/fixtures/site-profile.json`.

## Estrategia

### 1. Testes unitarios

Nao foram implementados porque Cypress Component Testing depende do codigo dos componentes e do framework da aplicacao, e esse material nao esta no repositorio atual.

Quando o codigo-fonte estiver disponivel, priorizar:

- formulario de login
- botao principal de acesso
- validacao de campos obrigatorios
- mensagens de erro
- estados de carregamento

### 2. Testes de integracao

Foram implementados testes E2E controlados com interceptacao para validar:

- envio do payload de autenticacao
- tratamento de erro `401`
- tratamento de indisponibilidade do backend

Objetivo: verificar a integracao entre tela, formulario e chamada HTTP sem depender do backend real.

### 3. Testes de regressao

Foi implementada uma suite curta de regressao critica para o fluxo de login real:

- carregamento da tela de autenticacao
- rejeicao de credenciais invalidas
- autenticacao com credenciais validas

Objetivo: proteger o fluxo mais critico e o principal ponto de regressao mencionado implicitamente pelos insumos.

## Sinais de falha observavel

Os pontos abaixo foram extraidos da referencia complementar de cybersecurity, mas aplicados apenas como falhas funcionais observaveis:

- mensagens excessivamente verbosas no erro de login
- falha de validacao ou bloqueio inadequado apos credenciais invalidas
- quebra da tela quando o backend responde com erro ou indisponibilidade
- persistencia indevida do formulario apos autenticacao bem-sucedida

## Matriz de testes

| ID | Tipo | Funcionalidade | Objetivo | Prioridade | Arquivo Cypress | Status |
|----|------|----------------|----------|------------|-----------------|--------|
| UT-01 | Unitario | Formulario de login | Validar renderizacao dos campos email, senha e CTA | Alta | `cypress/component/LoginForm.cy.jsx` | Bloqueado por ausencia do codigo-fonte |
| UT-02 | Unitario | Validacao local do formulario | Garantir campos obrigatorios e mensagens basicas | Alta | `cypress/component/LoginForm.cy.jsx` | Bloqueado por ausencia do codigo-fonte |
| UT-03 | Unitario | Botao de submit | Confirmar estado habilitado/desabilitado e loading | Media | `cypress/component/LoginButton.cy.jsx` | Bloqueado por ausencia do codigo-fonte |
| IT-01 | Integracao | Login + request HTTP | Verificar envio do payload esperado para autenticacao | Alta | `cypress/e2e/integration/auth-flow.cy.js` | Implementado |
| IT-02 | Integracao | Login + retorno 401 | Validar comportamento da UI com credenciais rejeitadas | Alta | `cypress/e2e/integration/auth-flow.cy.js` | Implementado |
| IT-03 | Integracao | Login + backend indisponivel | Garantir que a tela nao quebra diante de falha de rede | Alta | `cypress/e2e/integration/auth-flow.cy.js` | Implementado |
| RG-01 | Regressao | Tela de login | Garantir carregamento dos campos criticos | Alta | `cypress/e2e/regression/smoke-login.cy.js` | Implementado |
| RG-02 | Regressao | Login invalido | Garantir que erro de autenticacao continua visivel | Alta | `cypress/e2e/regression/smoke-login.cy.js` | Implementado |
| RG-03 | Regressao | Login valido | Garantir que o acesso principal continua funcionando | Alta | `cypress/e2e/regression/smoke-login.cy.js` | Implementado |

## Ajustes minimos para finalizar a execucao real

1. informar a URL da aplicacao via `CYPRESS_baseUrl`
2. revisar a rota de login em `cypress/fixtures/site-profile.json`
3. alinhar os seletores reais do site no mesmo arquivo
4. caso o contrato de autenticacao seja diferente, ajustar os mocks em `cypress/fixtures/api-responses.json`

