---
title: 'PRD — Painel Administrativo de Produtos (Criação)'
type: prd
scope: 'products'
status: approved
created: '2026-05-24'
updated: '2026-05-24'
---

## Problema

O administrador não possui uma forma de adicionar novos produtos à aplicação. Sem um formulário de criação, o painel administrativo está incompleto e o CRUD não pode ser exercido.

## Objetivo

O administrador consegue preencher um formulário com os dados de um novo produto e submetê-lo via `POST /products`. Após o sucesso, é redirecionado de volta à listagem.

## Contexto

- A aplicação consome a Fake Store API (`https://fakestoreapi.com`)
- Endpoint utilizado: `POST /products` — aceita body com `title`, `price`, `description`, `category`, `image` e retorna o objeto criado com `id` gerado
- A API é uma fake: o objeto retornado tem `id` simulado e não é persistido
- A rota de criação é `/products/new`, acessível pelo botão "Novo Produto" da listagem
- O layout segue o padrão de admin panel: toolbar com título e botão de voltar + formulário centralizado

## Personas e Usuários Afetados

| Persona               | Como é afetada                              |
| --------------------- | ------------------------------------------- |
| Administrador da loja | Precisa cadastrar novos produtos no sistema |

## Requisitos Funcionais

- RF01: A rota `/products/new` exibe um formulário de criação de produto
- RF02: O formulário deve conter os campos: título (`text`), preço (`number`), descrição (`textarea`), categoria (`text`) e imagem (`text` com URL)
- RF03: Todos os campos são obrigatórios
- RF04: O campo preço deve aceitar apenas valores numéricos positivos
- RF05: O botão "Salvar" deve estar desabilitado enquanto o formulário for inválido
- RF06: Ao submeter o formulário válido, deve disparar `POST /products` com os dados preenchidos
- RF07: Enquanto a requisição estiver em andamento, o botão "Salvar" deve exibir um indicador de loading e ficar desabilitado
- RF08: Em caso de sucesso, redirecionar para `/products`
- RF09: Em caso de erro na requisição, exibir mensagem de erro sem navegar
- RF10: O botão "Cancelar" / ícone de voltar deve navegar para `/products` sem submeter o formulário

## Requisitos Não Funcionais

- RNF01: O formulário deve validar os campos em tempo real (on blur ou on change)
- RNF02: Mensagens de erro de validação devem ser exibidas abaixo de cada campo inválido
- RNF03: A interface deve ser responsiva — funcionar adequadamente em desktop e mobile

## Fora de Escopo

- Upload de imagem (apenas URL como texto)
- Seleção de categoria via dropdown populado da API
- Preview da imagem em tempo real
- Confirmação de saída com dados não salvos (dirty form guard)

## Critérios de Aceitação (alto nível)

- [ ] CA01: Ao acessar `/products/new`, um formulário com os 5 campos é exibido
- [ ] CA02: Campos inválidos exibem mensagem de erro específica após interação
- [ ] CA03: O botão "Salvar" está desabilitado com formulário inválido
- [ ] CA04: Ao submeter formulário válido, o loader aparece no botão e a requisição é disparada
- [ ] CA05: Em sucesso, o usuário é redirecionado para `/products`
- [ ] CA06: Em erro da API, a mensagem de erro é exibida no formulário
- [ ] CA07: O botão "Cancelar" retorna para `/products`

## Métricas de Sucesso

| Métrica                          | Baseline | Meta               |
| -------------------------------- | -------- | ------------------ |
| Todos os CAs cobertos por testes | 0%       | 100%               |
| Build sem erros ou warnings      | —        | ✓                  |
| Acessibilidade (labels e foco)   | —        | Sem erros críticos |

## Riscos e Dependências

| Risco / Dependência               | Impacto                      | Mitigação                                   |
| --------------------------------- | ---------------------------- | ------------------------------------------- |
| Fake Store API não persiste dados | Produto não aparece na lista | Esperado — comportamento documentado da API |
| Fake Store API fora do ar         | Criação falha                | Tratar erro com mensagem no formulário      |

## Referências

- Endpoint: `POST https://fakestoreapi.com/products`
- Body: `{ title, price, description, category, image }`
- Resposta esperada: `{ id, title, price, description, category, image, rating: { rate, count } }`
