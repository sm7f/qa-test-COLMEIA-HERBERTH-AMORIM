# Suite Cypress - Colmeia QA

Suite criada para o teste tecnico descrito em [siteteste.md](./siteteste.md), com estrategia guiada por [agt-cypress.md](./agt-cypress.md) e exploracao controlada do alvo real `https://teste-colmeia-qa.colmeia-corp.com/`.

## Resumo para o recrutador

O trabalho entregue cobre quatro frentes:

- mapeamento tecnico do alvo real
- definicao de cenarios de teste priorizados
- implementacao da suite Cypress
- documentacao objetiva dos achados encontrados

O alvo inspecionado e um front Angular `21.1.3`, servido como site estatico. Pela analise do HTML e do bundle principal, foram identificadas as rotas:

- `/`
- `/dashboard`
- `/dashboard/campanha/bancos-de-dados`
- `/dashboard/campanha/colmeia-forms`
- `/easter-eggs`

## Achados principais

Falhas reais identificadas no comportamento do site:

1. usuario nao autenticado consegue acessar `/dashboard/campanha/bancos-de-dados`
2. login valido abre um modal com mensagem contraditoria: `Seu login está incorreto, quer continuar?`
3. pagina `Colmeia Forms` renderiza em branco
4. botao de arquivar chama a mesma acao do botao de apagar
5. item em branco pode ser criado depois de insistir no submit invalido
6. apos remover o ultimo item, o estado vazio nao volta a aparecer
7. rota `/easter-eggs` exposta publicamente lista os bugs da aplicacao

## Estrutura entregue

```txt
cypress/
  component/
    README.md
  e2e/
    integration/
      auth-state.cy.js
    regression/
      critical-flows.cy.js
      known-defects.cy.js
  fixtures/
    site-profile.json
    users.json
  support/
    commands.js
    e2e.js
docs/
  estrategia-e-cenarios.md
```

## Suites implementadas

### Integracao

Arquivo: [cypress/e2e/integration/auth-state.cy.js](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/cypress/e2e/integration/auth-state.cy.js:1)

- validacao de erro no login invalido
- login valido com transicao para dashboard via modal
- acesso direto ao dashboard sem autenticacao

### Regressao critica

Arquivo: [cypress/e2e/regression/critical-flows.cy.js](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/cypress/e2e/regression/critical-flows.cy.js:1)

- carga da tela de login
- login valido ate o dashboard
- abertura da area de bancos de dados
- acesso direto a pagina de easter eggs

### Regressao para evidenciar defeitos

Arquivo: [cypress/e2e/regression/known-defects.cy.js](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/cypress/e2e/regression/known-defects.cy.js:1)

- bloqueio esperado de rota privada sem login
- login valido sem mensagem incorreta
- renderizacao esperada de `Colmeia Forms`
- arquivamento sem exclusao
- bloqueio de item em branco
- retorno do estado vazio apos exclusao total

Esses cenarios foram escritos para falhar no estado atual da aplicacao, justamente para evidenciar os bugs encontrados.

## Instalar e executar

Foi preparado um runtime local de Node no proprio diretorio para viabilizar a instalacao do Cypress neste ambiente.

```bash
export PATH="$PWD/.tools/node-v24.14.1-linux-x64/bin:$PATH"
npm install
npx cypress open
npm run test:integration
npm run test:regression
npm run test:defects
```

## Resultado da execucao neste ambiente

- `npm install`: executado com sucesso
- download do Cypress `15.14.2`: executado com sucesso
- `npx cypress verify`: falhou por incompatibilidade do binario do runner neste runtime

Erro observado:

```txt
Cypress: bad option: --no-sandbox
Cypress: bad option: --smoke-test
```

Por isso, a suite ficou pronta e instalada, mas a execucao local do runner Cypress nao concluiu neste container. O bloqueio e de ambiente, nao de implementacao da suite.

## Evidencias tecnicas usadas

- HTML inicial do alvo, que expoe os seletores reais de login
- bundle `main-OLCR3OTF.js`, que expoe rotas, validacoes e handlers
- headers HTTP, que mostram hospedagem estatica
- ausencia de `robots.txt` e `sitemap.xml`

Detalhamento completo em [docs/estrategia-e-cenarios.md](/home/sm7f/Project/Portifolio/Portifolio-Agente/Projetos/qa-test/docs/estrategia-e-cenarios.md:1).
