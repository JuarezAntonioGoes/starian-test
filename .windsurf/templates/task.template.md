---
title: '<ID> — <Título da Tarefa>'
type: task
id: 'T00'
scope: '<escopo>'
task-list: 'wip/tasks/<escopo>/<nome-da-feature>/<nome>.task-list.md'
status: pending # pending | in-progress | done | blocked
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
branch: ''
commit: ''
---

## Descrição

> O que deve ser feito nesta tarefa. Seja específico: arquivos a criar/modificar, comportamentos esperados.

## Contexto

> Por que esta tarefa existe? Qual parte da tech spec ou do PRD ela implementa?

**Tech spec referência:** seção X.Y  
**ACs cobertos:** TAC01, TAC02

## Critérios de Conclusão (DoD)

- [ ] Código implementado conforme a tech spec
- [ ] Testes unitários escritos e passando (`yarn test`)
- [ ] Sem erros de lint/prettier (`yarn lint-staged`)
- [ ] Commit feito com mensagem conventional

## Subtarefas

- [ ] 1.
- [ ] 2.
- [ ] 3.

## Arquivos Afetados

| Arquivo       | Ação              |
| ------------- | ----------------- |
| `src/app/...` | criar / modificar |

## Testes a Escrever

| Descrição | Arquivo |
| --------- | ------- |
|           |         |

## Bloqueios

> Registre aqui qualquer impedimento ou dúvida que precise ser resolvida antes de continuar.

-

## Notas de Implementação

> Decisões tomadas durante a execução, alternativas descartadas, observações relevantes.

-
