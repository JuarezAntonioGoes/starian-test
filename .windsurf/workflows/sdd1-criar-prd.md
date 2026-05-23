---
description: SDD Etapa 1 — Criar o PRD (Product Requirements Document) de uma feature
---

## Objetivo

Criar o PRD de uma feature antes de qualquer implementação. O PRD captura o **problema**, os **requisitos funcionais e não funcionais** e os **critérios de aceitação** de alto nível, sem detalhar a solução técnica.

## Quando usar

Use este workflow ao iniciar uma feature nova, uma melhoria significativa ou qualquer mudança que afete o comportamento visível ao usuário.

## Passos

1. Identifique o nome e domínio da feature a ser especificada.

2. Copie o template base:

   ```
   .windsurf/templates/prd.template.md
   → wip/prds/<escopo>/<nome-da-feature>.prd.md
   ```

3. Preencha o PRD seguindo as seções do template:
   - **Problema** — qual dor ou necessidade esta feature endereça
   - **Objetivo** — o que será verdade quando a feature estiver pronta
   - **Requisitos Funcionais** — o que o sistema deve fazer (RF01, RF02...)
   - **Requisitos Não Funcionais** — performance, acessibilidade, segurança
   - **Fora de Escopo** — o que explicitamente não será feito
   - **Critérios de Aceitação** — verificáveis pelo PO, sem jargão técnico

4. Revise o PRD contra o contexto do projeto (arquitetura, decisões técnicas e PRDs existentes em `wip/prds/<escopo>/`):
   - Os requisitos são consistentes com a arquitetura definida?
   - Existe sobreposição com features já especificadas?

5. Atualize o status do frontmatter para `review` e registre a data.

6. Quando aprovado, atualize para `status: approved`.

## Saída esperada

Arquivo `wip/prds/<escopo>/<nome>.prd.md` com status `approved`, pronto para ser consumido pelo workflow `sdd2-criar-tech-spec`.

## Próximo passo

Execute `/sdd2-criar-tech-spec` passando o caminho do PRD criado.
