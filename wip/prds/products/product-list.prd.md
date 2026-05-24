---
title: 'PRD — Painel Administrativo de Produtos (Listagem)'
type: prd
scope: 'products'
status: approved
created: '2026-05-23'
updated: '2026-05-23'
---

## Problema

O administrador não possui uma interface centralizada para gerenciar os produtos da aplicação. Sem uma listagem, é impossível identificar, editar ou excluir registros existentes. Esta é a feature de entrada do CRUD — sem ela, nenhuma outra operação de gerenciamento faz sentido.

## Objetivo

O usuário consegue acessar o painel administrativo da aplicação e visualizar todos os produtos da Fake Store API em uma tabela organizada. A partir dela, é possível criar um novo produto, editar ou excluir qualquer item da lista.

## Contexto

- A aplicação consome a Fake Store API (`https://fakestoreapi.com`)
- Endpoint utilizado: `GET /products` — retorna array de produtos com campos: `id`, `title`, `price`, `description`, `category`, `image`, `rating { rate, count }`
- A API não requer autenticação
- A API é pública e pode ter latência variável — estados de loading e erro são necessários
- Esta é a tela principal (rota `/products`) da aplicação — um painel administrativo orientado ao gerenciamento de produtos, não ao consumo/compra
- O layout segue o padrão de admin panel: toolbar com ação global ("Novo Produto") + tabela com ações por linha (Editar, Excluir)

## Personas e Usuários Afetados

| Persona               | Como é afetada                                                   |
| --------------------- | ---------------------------------------------------------------- |
| Administrador da loja | Precisa visualizar, criar, editar e excluir produtos do catálogo |

## Requisitos Funcionais

- RF01: A aplicação deve exibir a lista completa de produtos retornados pelo endpoint `GET https://fakestoreapi.com/products` em uma tabela
- RF02: Cada linha da tabela deve exibir: imagem (thumbnail), título, categoria e preço
- RF03: A tabela deve exibir um indicador de carregamento enquanto a requisição estiver em andamento
- RF04: Caso a requisição falhe, a aplicação deve exibir uma mensagem de erro com opção de tentar novamente
- RF05: Cada linha da tabela deve ter ações de **Editar** e **Excluir** acessíveis diretamente na coluna de ações
- RF06: A tabela deve ser acessível a partir da rota `/products`
- RF07: A toolbar do painel deve conter um botão **"Novo Produto"** que navega para a tela de criação

## Requisitos Não Funcionais

- RNF01: A listagem deve renderizar visualmente em menos de 3 segundos em conexão normal
- RNF02: A interface deve ser responsiva — funcionar adequadamente em desktop e mobile
- RNF03: Os elementos interativos (botões de ação) devem ser acessíveis via teclado e ter labels descritivos para leitores de tela
- RNF04: O estado de loading deve ser perceptível e não deve causar layout shift após o carregamento

## Fora de Escopo

- Paginação ou scroll infinito (a API retorna todos os produtos de uma vez)
- Filtro ou busca por produtos
- Ordenação da listagem
- Detalhes expandidos do produto (modal ou página de detalhe)
- Autenticação ou controle de acesso

## Critérios de Aceitação (alto nível)

- [ ] CA01: Ao acessar `/products`, o usuário vê um loader enquanto os dados são buscados
- [ ] CA02: Após o carregamento, todos os produtos da API são exibidos em tabela com imagem, título, categoria e preço
- [ ] CA03: Se a requisição falhar, uma mensagem de erro é exibida com botão "Tentar novamente"
- [ ] CA04: Cada linha da tabela possui botões de "Editar" e "Excluir" visíveis e acessíveis
- [ ] CA05: A toolbar exibe o botão "Novo Produto" que leva à tela de criação
- [ ] CA06: A página é legível e utilizável em telas de 375px (mobile) e 1280px (desktop)
- [ ] CA07: O estado vazio (API retorna array vazio) exibe mensagem "Nenhum produto encontrado"

## Métricas de Sucesso

| Métrica                          | Baseline | Meta               |
| -------------------------------- | -------- | ------------------ |
| Todos os CAs cobertos por testes | 0%       | 100%               |
| Build sem erros ou warnings      | —        | ✓                  |
| Acessibilidade (labels e foco)   | —        | Sem erros críticos |

## Riscos e Dependências

| Risco / Dependência       | Impacto                     | Mitigação                                 |
| ------------------------- | --------------------------- | ----------------------------------------- |
| Fake Store API fora do ar | Listagem não carrega        | Tratar erro com mensagem + retry          |
| API retornar array vazio  | Tela em branco sem feedback | Exibir estado "nenhum produto encontrado" |

## Referências

- Endpoint: `GET https://fakestoreapi.com/products`
- Resposta esperada: array de objetos `{ id, title, price, description, category, image }`
