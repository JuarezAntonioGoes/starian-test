---
description: SDD Etapa 4 — Executar uma única task do task-list
---

## Objetivo

Implementar uma tarefa atômica seguindo o ciclo red → green → refactor, garantindo que os testes passem e o código siga as decisões da tech spec antes de avançar para a próxima tarefa.

## Pré-requisitos

- Task list criada pelo workflow `sdd3-criar-tasks` em `wip/tasks/<escopo>/`
- Tarefa com `status: pending` selecionada

## Passos

1. **Selecione a próxima tarefa pendente** no task-list e abra o arquivo `.task.md` correspondente.

2. **Atualize o status** da tarefa para `in-progress` e registre a data:

   ```yaml
   status: in-progress
   updated: 'YYYY-MM-DD'
   ```

3. **Crie a branch de trabalho** (se usando git flow):

   ```bash
   git checkout -b <domínio>/T<id>-<descricao-curta>
   ```

4. **Escreva os testes primeiro** (red):
   - Crie o arquivo `.spec.ts` conforme a seção "Testes a escrever" da task
   - Os testes devem falhar neste ponto
   - Execute: `yarn test --run`

5. **Implemente o código** (green):
   - Crie/modifique apenas os arquivos listados em "Arquivos Afetados"
   - Implemente o mínimo necessário para os testes passarem
   - Execute: `yarn test --run`

6. **Refatore** se necessário, mantendo os testes verdes:
   - Execute: `yarn test --run`

7. **Verifique os critérios de conclusão (DoD)**:
   - [ ] Todos os testes da tarefa passando
   - [ ] Prettier sem erros nos arquivos modificados
   - [ ] Nenhum `console.log` ou código temporário
   - [ ] Os TACs cobertos por esta tarefa estão satisfeitos

8. **Faça o commit** com conventional commits:

   ```bash
   git add -A
   git commit -m "<type>(<escopo>): <descrição> [T<id>]"
   ```

   Exemplos:

   ```
   feat(products): implement ProductService [T03]
   test(products): add unit tests for ProductService [T04]
   feat(products): implement ProductListComponent [T05]
   refactor(products): clean up ProductListComponent [T05]
   ```

9. **Atualize a tarefa** após o commit:

   ```yaml
   status: done
   commit: '<hash>'
   updated: 'YYYY-MM-DD'
   ```

10. **Atualize o task-list**: marque a tarefa como `[x]` e incremente o contador de concluídas.

11. **Volte ao passo 1** com a próxima tarefa pendente, ou execute `/sdd5-limpar-wip` se todas as tarefas estiverem concluídas.

## Comandos úteis

```bash
yarn test --run                    # rodar testes uma vez
yarn test --watch                  # modo watch durante desenvolvimento
yarn build                         # verificar build sem erros
```

## Em caso de bloqueio

Registre o bloqueio na seção "Bloqueios" do arquivo `.task.md` e marque a tarefa como `blocked`. Resolva o bloqueio antes de continuar.
