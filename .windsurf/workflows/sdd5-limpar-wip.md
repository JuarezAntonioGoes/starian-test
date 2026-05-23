---
description: SDD Etapa 5 — Finalizar a feature, limpar WIP e atualizar specs
---

## Objetivo

Fechar o ciclo SDD de uma feature: verificar completude, atualizar o status de todos os documentos, fazer merge e garantir que o projeto esteja em estado limpo.

## Pré-requisitos

- Todas as tarefas em `wip/tasks/<escopo>/` com `status: done`
- Todos os testes passando em `main`/branch principal

## Passos

1. **Verifique completude dos testes**:

   ```bash
   yarn test --run
   yarn build
   ```

   Todos devem passar sem erros ou warnings críticos.

2. **Confirme cobertura dos TACs**:
   - Abra a tech spec em `wip/tech-specs/<escopo>/`
   - Marque cada TAC como `[x]` que foi implementado e testado
   - Se algum TAC não foi coberto, crie uma tarefa adicional antes de continuar

3. **Atualize o status dos documentos**:

   PRD:

   ```yaml
   status: implemented
   updated: 'YYYY-MM-DD'
   ```

   Tech Spec:

   ```yaml
   status: implemented
   commit: '<hash do último commit da feature>'
   updated: 'YYYY-MM-DD'
   ```

   Task List:

   ```yaml
   status: done
   updated: 'YYYY-MM-DD'
   ```

4. **Registre decisões técnicas novas** que surgiram durante a implementação na tech spec em `wip/tech-specs/<escopo>/` (seção "Decisões Técnicas e Trade-offs").

5. **Revise e atualize o README** do projeto se a feature afeta o setup, uso ou comportamento documentado.

6. **Merge para a branch principal**:

   ```bash
   git checkout main
   git merge --no-ff <branch-da-feature> -m "feat(<escopo>): complete <nome-da-feature> implementation"
   git push
   ```

7. **Limpe branches locais**:

   ```bash
   git branch -d <branch-da-feature>
   ```

8. **Remova arquivos WIP** se houver rascunhos temporários não commitados.

9. **Verifique o estado final**:
   ```bash
   git status              # working tree limpa
   yarn test --run         # todos os testes passando
   yarn build              # build sem erros
   ```

## Checklist de conclusão da feature

- [ ] Todos os testes unitários passando
- [ ] Build sem erros
- [ ] TACs da tech spec todos marcados como `[x]`
- [ ] PRD, Tech Spec e Task List com `status: implemented`
- [ ] Decisões técnicas novas registradas na Tech Spec
- [ ] README atualizado se necessário
- [ ] Branch mergeada e deletada
- [ ] Commit de merge feito com conventional commits

## Próximo passo

Volte ao workflow `/sdd1-criar-prd` para a próxima feature.
