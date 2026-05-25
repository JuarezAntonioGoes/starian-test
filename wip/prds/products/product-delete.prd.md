---
title: 'PRD — Excluir Produto'
scope: products
status: approved
created: '2026-05-25'
updated: '2026-05-25'
---

## Problema

O administrador não tem como remover produtos obsoletos ou incorretos do catálogo diretamente pela interface. A exclusão precisa ocorrer com confirmação explícita para evitar deleções acidentais.

## Objetivo

Permitir que o administrador exclua um produto a partir da listagem, com confirmação via dialog modal antes de efetuar a operação.

## Contexto

- Feature complementar ao `product-list`, `product-create` e `product-edit`.
- API: `DELETE /products/:id` — Fake Store API.
- A resposta da API retorna o produto deletado, mas o item deve ser removido da lista local.

## Personas

- **Administrador** — usuário único da aplicação, responsável pelo gerenciamento do catálogo.

## Requisitos Funcionais

- **RF01** — O botão "Excluir" deve estar visível na linha de cada produto na tabela.
- **RF02** — Ao clicar em "Excluir", um dialog de confirmação deve ser exibido com o nome do produto.
- **RF03** — Se o usuário confirmar, o sistema deve chamar `DELETE /products/:id`.
- **RF04** — Após exclusão bem-sucedida, o produto deve ser removido da lista sem recarregar a página.
- **RF05** — Se o usuário cancelar o dialog, nenhuma ação deve ser executada.
- **RF06** — Durante a requisição, o botão "Excluir" correspondente deve ficar desabilitado.
- **RF07** — Em caso de erro HTTP, uma mensagem de erro deve ser exibida (snackbar).

## Requisitos Não Funcionais

- **RNF01** — A operação não deve recarregar a lista inteira; apenas remove o item do array de signals.
- **RNF02** — O dialog deve ser acessível (foco gerenciado, `aria-label` no botão de fechar).

## Fora de Escopo

- Exclusão em lote (múltiplos produtos de uma vez).
- Soft delete / arquivamento.
- Desfazer exclusão (undo).

## Critérios de Aceitação

- **CA01** — Botão "Excluir" visível em cada linha da tabela de produtos.
- **CA02** — Clicar em "Excluir" exibe dialog com o nome do produto e dois botões: "Cancelar" e "Confirmar".
- **CA03** — "Cancelar" fecha o dialog sem chamar a API.
- **CA04** — "Confirmar" chama `DELETE /products/:id` e remove o produto da lista.
- **CA05** — Durante a requisição, o botão "Excluir" da linha correspondente fica desabilitado.
- **CA06** — Erro HTTP exibe snackbar com mensagem de erro.

## Métricas de Sucesso

- Fluxo completo de exclusão funcional sem erros.
- Nenhum reload de página durante a operação.

## Riscos

- Fake Store API não persiste a exclusão (mock); comportamento local deve ser tratado independentemente.

## Referências

- API: `DELETE https://fakestoreapi.com/products/{id}`
- PRD listagem: `wip/prds/products/product-list.prd.md`
