# Prompt de IA — Testes com Cypress para Site

Você é um especialista em QA Automation com foco em Cypress.

Estou participando de um processo seletivo e preciso criar uma estratégia de testes automatizados para um site usando Cypress.

## Objetivo

Criar testes somente dos seguintes tipos:

1. Testes unitários
2. Testes de integração
3. Testes de regressão

Não incluir testes de performance, segurança, carga, acessibilidade, visual regression ou testes exploratórios.

Também não transformar todos os cenários em E2E completos. O uso do Cypress deve ser controlado e adequado ao escopo.

---

## Ferramenta Obrigatória

Usar Cypress como ferramenta principal.

Utilizar:

- Cypress Component Testing para testes unitários de componentes
- Cypress E2E com mocks/intercepts para testes de integração
- Cypress E2E controlado para suíte de regressão crítica
- `cy.intercept()` para simular APIs quando necessário
- fixtures para massa de dados
- comandos customizados quando fizer sentido

---

## Contexto Técnico

Analise o projeto e identifique:

- Framework utilizado
- Estrutura de pastas
- Componentes principais
- Fluxos críticos
- APIs consumidas
- Formulários importantes
- Serviços/funções relevantes
- Pontos com maior risco de regressão

Se alguma informação não estiver clara, sinalize como:

> Suposição técnica: ...

Não invente endpoints, dados ou comportamentos que não existam no projeto.

---

# 1. Estratégia de Testes

## 1.1 Testes Unitários com Cypress

Use Cypress Component Testing para validar componentes isolados.

Exemplos de alvos:

- botões
- inputs
- formulários pequenos
- cards
- modais
- componentes de listagem
- componentes com props
- componentes com estados simples
- validações visuais controladas

Validar:

- renderização correta
- props obrigatórias
- comportamento de clique
- mensagens de erro
- estados de loading
- campos obrigatórios
- comportamento condicional

Importante:

Não chamar de teste unitário um fluxo completo entre várias páginas.

---

## 1.2 Testes de Integração com Cypress

Usar Cypress para validar a integração entre:

- tela + service
- formulário + API
- componente + estado
- página + mock de backend
- fluxo de login com interceptação
- cadastro com resposta simulada
- consulta de dados via API mockada

Usar `cy.intercept()` para controlar:

- resposta de sucesso
- resposta de erro
- timeout
- payload inválido
- API indisponível

O objetivo é validar se as partes do sistema conversam corretamente.

---

## 1.3 Testes de Regressão com Cypress

Criar uma suíte de regressão com os fluxos mais importantes do site.

A regressão deve proteger funcionalidades que não podem quebrar após alterações.

Exemplos:

- página inicial carrega corretamente
- login continua funcionando
- formulário principal valida campos obrigatórios
- envio de formulário com sucesso
- mensagens de erro aparecem corretamente
- navegação principal funciona
- dados mockados continuam sendo exibidos
- componente crítico continua renderizando

A suíte de regressão deve ser curta, objetiva e focada nos fluxos de maior risco.

---

# 2. Estrutura de Pastas Esperada

Sugerir uma estrutura parecida com:

```txt
cypress/
  e2e/
    integration/
      login.cy.js
      form-submit.cy.js
    regression/
      critical-flow.cy.js
      navigation.cy.js
  component/
    Button.cy.jsx
    LoginForm.cy.jsx
    ProductCard.cy.jsx
  fixtures/
    users.json
    products.json
    errors.json
  support/
    commands.js
    e2e.js
    component.js
```

Adaptar conforme o projeto real.

---

# 3. Instalação e Configuração

Gerar os comandos necessários para instalar Cypress.

Exemplo:

```bash
npm install cypress --save-dev
```

Gerar também os comandos de abertura e execução:

```bash
npx cypress open
npx cypress run
```

Se o projeto usar React, Vite ou Next.js, configurar Cypress Component Testing conforme a stack.

---

# 4. Scripts no package.json

Criar scripts como:

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "test:unit": "cypress run --component",
    "test:integration": "cypress run --spec 'cypress/e2e/integration/**/*.cy.js'",
    "test:regression": "cypress run --spec 'cypress/e2e/regression/**/*.cy.js'"
  }
}
```

Adaptar extensões para `.js`, `.jsx`, `.ts` ou `.tsx` conforme o projeto.

---

# 5. Matriz de Testes

Criar uma matriz com o seguinte formato:

| ID | Tipo | Funcionalidade | Objetivo | Prioridade | Arquivo Cypress | Status |
|----|------|----------------|----------|------------|-----------------|--------|

Tipos permitidos:

- Unitário
- Integração
- Regressão

---

# 6. Casos de Teste Unitário

Para cada caso unitário, usar:

```yaml
ID:
Tipo: Unitário
Ferramenta: Cypress Component Testing
Componente:
Objetivo:
Pré-condição:
Entrada/Props:
Ação:
Resultado Esperado:
Prioridade:
Arquivo sugerido:
```

---

# 7. Casos de Teste de Integração

Para cada caso de integração, usar:

```yaml
ID:
Tipo: Integração
Ferramenta: Cypress E2E + cy.intercept
Funcionalidade:
Módulos Integrados:
Endpoint Mockado:
Pré-condição:
Massa de Dados:
Passos:
Resultado Esperado:
Prioridade:
Arquivo sugerido:
```

---

# 8. Casos de Teste de Regressão

Para cada caso de regressão, usar:

```yaml
ID:
Tipo: Regressão
Ferramenta: Cypress E2E
Funcionalidade Protegida:
Motivo da Regressão:
Risco caso quebre:
Pré-condição:
Passos:
Resultado Esperado:
Frequência:
Prioridade:
Arquivo sugerido:
```

---

# 9. Exemplos de Código

Gerar exemplos reais de código Cypress para:

1. Teste unitário de componente
2. Teste de integração com `cy.intercept()`
3. Teste de regressão de fluxo crítico

Os exemplos devem conter:

- `describe`
- `it`
- seletores claros
- assertions objetivas
- uso de fixtures quando fizer sentido
- nomes profissionais para os testes

Evitar seletores frágeis como classes CSS aleatórias.

Preferir:

```js
cy.get('[data-cy="nome-do-elemento"]')
```

---

# 10. Boas Práticas Obrigatórias

Aplicar as seguintes boas práticas:

- usar `data-cy` para seletores estáveis
- evitar dependência de texto muito volátil
- evitar waits fixos como `cy.wait(5000)`
- usar `cy.intercept()` para controlar APIs
- separar testes por tipo
- criar fixtures para massa de dados
- manter testes pequenos e legíveis
- não validar regra que não exista no requisito
- não inventar comportamento esperado
- não declarar teste como aprovado sem execução real

---

# 11. Critérios de Entrada

Listar o que precisa existir antes de executar os testes:

- aplicação executando localmente
- Cypress instalado
- ambiente de teste configurado
- URLs definidas
- mocks ou APIs disponíveis
- massa de dados criada
- seletores `data-cy` adicionados
- scripts configurados no `package.json`

---

# 12. Critérios de Saída

Definir critérios objetivos:

- todos os testes unitários críticos passando
- todos os testes de integração críticos passando
- suíte de regressão sem falhas críticas
- defeitos documentados
- evidências coletadas
- relatório de execução gerado

---

# 13. Relatório Final de QA

Gerar modelo de relatório:

```md
# Relatório de Testes com Cypress

## Resumo da Execução

- Data:
- Ambiente:
- Versão testada:
- Ferramenta:
- Total de testes:
- Aprovados:
- Reprovados:
- Bloqueados:

## Testes Unitários

- Total:
- Aprovados:
- Reprovados:
- Observações:

## Testes de Integração

- Total:
- Aprovados:
- Reprovados:
- Observações:

## Testes de Regressão

- Total:
- Aprovados:
- Reprovados:
- Observações:

## Defeitos Encontrados

| ID | Tipo | Severidade | Descrição | Status |
|----|------|------------|-----------|--------|

## Conclusão

Informar se o site está:

- Aprovado
- Aprovado com ressalvas
- Reprovado

Justificar tecnicamente a conclusão.
```

---

# 14. Restrições

Não criar:

- teste de performance
- teste de segurança
- teste de carga
- teste exploratório
- teste manual
- teste visual regression
- teste de acessibilidade
- E2E completo fora do escopo

Manter o foco em:

- unitário
- integração
- regressão

---

# Resultado Esperado

Entregar:

1. Estratégia de testes com Cypress
2. Estrutura de pastas
3. Matriz de testes
4. Casos unitários
5. Casos de integração
6. Casos de regressão
7. Scripts do package.json
8. Exemplos de código Cypress
9. Critérios de entrada e saída
10. Modelo de relatório final

---

# Observação para Processo Seletivo

Explique sua escolha técnica assim:

> Optei por Cypress porque consigo cobrir componentes isolados com Component Testing e validar integrações/regressões em navegador real, usando interceptações para controlar respostas de API. Mantive o escopo separado para não confundir teste unitário com fluxo E2E completo.
