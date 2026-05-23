---
description: SDD Etapa 3 — Quebrar a Tech Spec em tasks atômicas e executáveis
---

## Objetivo

Decompor a Tech Spec em tarefas pequenas, atômicas e independentes o suficiente para serem executadas uma de cada vez no workflow `sdd4-executar-task`.

## Pré-requisitos

- Tech Spec com `status: approved` em `wip/tech-specs/<escopo>/`

## Passos

1. Leia a Tech Spec completa, prestando atenção em:
   - Estrutura de arquivos (cada arquivo novo = candidato a tarefa)
   - Componentes listados
   - Serviços listados
   - TACs (cada TAC deve ser coberto por pelo menos uma tarefa)

2. Crie o arquivo de task list:

   ```
   .windsurf/templates/task-list.template.md
   → wip/tasks/<escopo>/<nome-da-feature>.task-list.md
   ```

3. Defina as tarefas seguindo esta ordem natural:
   - **Setup**: modelos de domínio, configuração de rotas
   - **Serviços**: implementação + testes do serviço
   - **Componentes**: um componente por tarefa (implementação + testes juntos)
   - **Integração**: verificação do fluxo completo, acessibilidade, responsividade
   - **Finalização**: atualização de README, revisão de specs

4. Para cada tarefa, crie um arquivo individual:

   ```
   .windsurf/templates/task.template.md
   → wip/tasks/<escopo>/<id>.task.md
   ```

   Preencha:
   - `id`: T01, T02, T03...
   - `title`: verbo no infinitivo + objeto (`Implementar ProductService`)
   - `status: pending`
   - **Descrição**: o que exatamente fazer
   - **Arquivos afetados**: lista de arquivos a criar/modificar
   - **Testes a escrever**: descrição dos casos de teste
   - **ACs cobertos**: quais TACs da tech spec esta tarefa satisfaz

5. Verifique que:
   - Cada TAC da tech spec está coberto por pelo menos uma tarefa
   - Nenhuma tarefa tem mais de um componente ou serviço principal
   - As dependências entre tarefas estão registradas no task-list

6. Atualize o contador no frontmatter do task-list (`Total de tarefas`).

## Saída esperada

- `wip/tasks/<escopo>/<nome>.task-list.md` com todas as tarefas listadas
- `wip/tasks/<escopo>/T01.task.md`, `T02.task.md`... um arquivo por tarefa

## Próximo passo

Execute `/sdd4-executar-task` começando pela primeira tarefa pendente.
