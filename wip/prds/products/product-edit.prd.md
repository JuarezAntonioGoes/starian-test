---
title: 'PRD — Painel Administrativo de Produtos (Edição)'
type: prd
scope: 'products'
status: approved
created: '2026-05-24'
updated: '2026-05-24'
---

## Problema

O administrador não possui uma forma de alterar os dados de produtos existentes. Sem um formulário de edição, o painel administrativo está incompleto e o CRUD não pode ser exercido plenamente.

## Objetivo

O administrador consegue editar os dados de um produto existente em um formulário pré-preenchido e submetê-lo via `PUT /products/:id`. Após o sucesso, é redirecionado de volta à listagem.

## Contexto

- A aplicação consome a Fake Store API (`https://fakestoreapi.com`)
- Endpoint de leitura: `GET /products/:id` — retorna o produto pelo id para pré-preencher o formulário
- Endpoint de atualização: `PUT /products/:id` — aceita body com `title`, `price`, `description`, `category`, `image` e retorna o objeto atualizado
- A API é uma fake: as alterações não são persistidas
- A rota de edição é `/products/:id/edit`, acessível pelo botão "Editar" de cada linha da listagem
- O layout segue o mesmo padrão do formulário de criação: toolbar com título e botão de voltar + formulário centralizado

## Personas e Usuários Afetados

| Persona               | Como é afetada                                             |
| --------------------- | ---------------------------------------------------------- |
| Administrador da loja | Precisa corrigir ou atualizar dados de produtos existentes |

## Requisitos Funcionais

- RF01: A rota `/products/:id/edit` exibe um formulário com os dados do produto pré-preenchidos
- RF02: O formulário deve conter os campos: título (`text`), preço (`number`), descrição (`textarea`), categoria (`text`) e imagem (`text` com URL)
- RF03: Ao acessar a rota, deve disparar `GET /products/:id` para carregar os dados do produto
- RF04: Enquanto os dados são carregados, exibir um indicador de loading no lugar do formulário
- RF05: Se o produto não for encontrado (404), exibir mensagem de erro e botão para voltar
- RF06: Todos os campos são obrigatórios
- RF07: O campo preço deve aceitar apenas valores numéricos positivos
- RF08: O botão "Salvar" deve estar desabilitado enquanto o formulário for inválido ou sem alterações
- RF09: Ao submeter o formulário válido, deve disparar `PUT /products/:id` com os dados preenchidos
- RF10: Enquanto a requisição de save estiver em andamento, o botão "Salvar" deve exibir loading e ficar desabilitado
- RF11: Em caso de sucesso, redirecionar para `/products`
- RF12: Em caso de erro na requisição de save, exibir mensagem de erro sem navegar
- RF13: O botão "Cancelar" / ícone de voltar deve navegar para `/products` sem submeter o formulário

## Requisitos Não Funcionais

- RNF01: O formulário deve validar os campos em tempo real (on blur ou on change)
- RNF02: Mensagens de erro de validação devem ser exibidas abaixo de cada campo inválido
- RNF03: A interface deve ser responsiva — funcionar adequadamente em desktop e mobile

## Fora de Escopo

- Upload de imagem (apenas URL como texto)
- Seleção de categoria via dropdown populado da API
- Preview da imagem em tempo real
- Confirmação de saída com dados não salvos (dirty form guard)
- Detecção de mudanças para habilitar/desabilitar o botão Salvar (simplificado: sempre habilitado se válido)

## Critérios de Aceitação (alto nível)

- [ ] CA01: Ao acessar `/products/:id/edit`, um loader é exibido enquanto os dados são buscados
- [ ] CA02: Após o carregamento, o formulário é exibido com os dados do produto pré-preenchidos
- [ ] CA03: Campos inválidos exibem mensagem de erro específica após interação
- [ ] CA04: O botão "Salvar" está desabilitado com formulário inválido
- [ ] CA05: Ao submeter formulário válido, o loader aparece no botão e a requisição é disparada
- [ ] CA06: Em sucesso, o usuário é redirecionado para `/products`
- [ ] CA07: Se o produto não for encontrado, mensagem de erro é exibida com botão de voltar
- [ ] CA08: Em erro da API ao salvar, a mensagem de erro é exibida no formulário
- [ ] CA09: O botão "Cancelar" retorna para `/products`

## Métricas de Sucesso

| Métrica                          | Baseline | Meta               |
| -------------------------------- | -------- | ------------------ |
| Todos os CAs cobertos por testes | 0%       | 100%               |
| Build sem erros ou warnings      | —        | ✓                  |
| Acessibilidade (labels e foco)   | —        | Sem erros críticos |

## Riscos e Dependências

| Risco / Dependência               | Impacto                        | Mitigação                                     |
| --------------------------------- | ------------------------------ | --------------------------------------------- |
| Fake Store API não persiste dados | Alteração não reflete na lista | Esperado — comportamento documentado da API   |
| Fake Store API fora do ar         | Carregamento e save falham     | Tratar erros com mensagem no formulário       |
| ID inválido na URL                | 404 ou erro de parse           | Tratar com mensagem de produto não encontrado |

## Referências

- Endpoint GET: `GET https://fakestoreapi.com/products/:id`
- Endpoint PUT: `PUT https://fakestoreapi.com/products/:id`
- Body: `{ title, price, description, category, image }`
- Resposta esperada: `{ id, title, price, description, category, image, rating: { rate, count } }`
