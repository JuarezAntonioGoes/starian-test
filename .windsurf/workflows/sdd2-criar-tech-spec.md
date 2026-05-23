---
description: SDD Etapa 2 — Criar a Tech Spec a partir de um PRD aprovado
---

## Objetivo

Traduzir os requisitos do PRD em uma especificação técnica detalhada: arquitetura de componentes, contratos de API, modelos de dados, estratégia de testes e acceptance criteria técnicos.

## Pré-requisitos

- PRD da feature com `status: approved` em `wip/prds/<escopo>/`

## Passos

1. Localize o PRD aprovado e leia todos os requisitos e critérios de aceitação.

2. Copie o template base:

   ```
   .windsurf/templates/tech-spec.template.md
   → wip/tech-specs/<escopo>/<nome-da-feature>.tech-spec.md
   ```

3. Preencha a Tech Spec:

   **Arquitetura e estrutura de arquivos**
   - Defina quais arquivos serão criados/modificados
   - Siga a estrutura `core/`, `features/`, `shared/` definida no projeto

   **Modelos de dados**
   - Defina interfaces TypeScript com tipos explícitos
   - Referencie modelos já existentes no projeto se houver

   **Contratos de API**
   - Liste todos os endpoints consumidos com método, URL, payload e resposta esperada

   **Componentes**
   - Para cada componente: seletor, inputs, outputs, estado interno com `signal()`

   **Serviços**
   - Para cada método público: assinatura, endpoint, tratamento de erros

   **Fluxo de dados**
   - Descreva o caminho desde o evento de UI até a re-renderização do template

   **Estratégia de testes**
   - Defina o que será testado por camada (serviço, componente)
   - Mapeie cada AC do PRD para pelo menos um teste

   **Acceptance Criteria Técnicos (TACs)**
   - Refinamento técnico dos CAs do PRD, verificáveis por código/teste

4. Verifique consistência com o restante das tech specs em `wip/tech-specs/<escopo>/`:
   - As decisões técnicas seguem o padrão já estabelecido no projeto?
   - Existe sobreposición com componentes ou serviços já especificados?

5. Atualize o status para `review`, depois `approved` quando validado.

## Saída esperada

Arquivo `wip/tech-specs/<escopo>/<nome>.tech-spec.md` com status `approved`, com TACs claros e estrutura de arquivos definida.

## Próximo passo

Execute `/sdd3-criar-tasks` passando o caminho da Tech Spec criada.
