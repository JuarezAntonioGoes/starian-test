---
title: 'Tech Spec — Painel Administrativo de Produtos (Listagem)'
type: tech-spec
scope: 'products'
prd: 'wip/prds/products/product-list.prd.md'
status: approved
created: '2026-05-23'
updated: '2026-05-23'
commit: ''
---

## Visão Geral Técnica

A feature implementa a tela principal do painel administrativo (`/products`). Um `ProductService` singleton expõe signals reativos (`products`, `loading`, `error`) alimentados por `HttpClient`. O `ProductListComponent` consome esses signals diretamente no template via `@if`/`@for` e renderiza uma `mat-table` com colunas de imagem, título, categoria, preço, avaliação e ações. A navegação para criação e edição usa o `Router` do Angular. Nenhum estado global externo (NgRx) é necessário.

## Arquitetura e Estrutura de Arquivos

```
src/app/
  core/
    models/
      product.model.ts          ← interfaces Product e Rating
    services/
      product.service.ts        ← HttpClient + signals de estado
      product.service.spec.ts
  features/
    products/
      product-list/
        product-list.component.ts
        product-list.component.html
        product-list.component.scss
        product-list.component.spec.ts
  app.routes.ts                 ← rota /products → ProductListComponent
```

## Modelos de Dados

```typescript
// src/app/core/models/product.model.ts

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
```

## Contratos de API

| Operação        | Método | Endpoint                            | Payload | Resposta    |
| --------------- | ------ | ----------------------------------- | ------- | ----------- |
| Listar produtos | GET    | `https://fakestoreapi.com/products` | —       | `Product[]` |

**Base URL** configurada via `environment.ts`:

```typescript
export const environment = {
  apiUrl: 'https://fakestoreapi.com',
};
```

## Componentes

### `ProductListComponent`

| Item               | Detalhe                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Seletor**        | `app-product-list`                                                                                                               |
| **Rota**           | `/products`                                                                                                                      |
| **Inputs**         | Nenhum (standalone, consome `ProductService` via `inject()`)                                                                     |
| **Outputs**        | Nenhum                                                                                                                           |
| **Estado interno** | Nenhum — consome `products`, `loading`, `error` signals do serviço                                                               |
| **Dependências**   | `ProductService`, `Router`, `MatTableModule`, `MatButtonModule`, `MatIconModule`, `MatToolbarModule`, `MatProgressSpinnerModule` |

**Colunas da tabela:**

| Coluna     | Conteúdo                                                        |
| ---------- | --------------------------------------------------------------- |
| `image`    | `<img>` thumbnail 48×48px                                       |
| `title`    | Título truncado a 1 linha                                       |
| `category` | Texto da categoria                                              |
| `price`    | Formatado como `$ 109.95`                                       |
| `rating`   | `rating.rate` / 5                                               |
| `actions`  | Botões Editar (`mat-icon-button`) e Excluir (`mat-icon-button`) |

## Serviços

### `ProductService`

Registrado com `providedIn: 'root'`. Estado gerenciado com `signal()`.

| Método / Propriedade | Assinatura               | Descrição                                           |
| -------------------- | ------------------------ | --------------------------------------------------- |
| `products`           | `Signal<Product[]>`      | Lista de produtos carregados                        |
| `loading`            | `Signal<boolean>`        | `true` enquanto a requisição estiver em andamento   |
| `error`              | `Signal<string \| null>` | Mensagem de erro ou `null`                          |
| `loadProducts()`     | `(): void`               | Dispara `GET /products`, atualiza signals de estado |

**Implementação de `loadProducts()`:**

```typescript
loadProducts(): void {
  this.loading.set(true);
  this.error.set(null);
  this.http.get<Product[]>(`${environment.apiUrl}/products`).pipe(
    catchError((err) => {
      this.error.set('Não foi possível carregar os produtos. Tente novamente.');
      return of([]);
    }),
    finalize(() => this.loading.set(false))
  ).subscribe(data => this.products.set(data));
}
```

## Fluxo de Dados

```
[ngOnInit do ProductListComponent]
    → [ProductService.loadProducts()]
    → [loading.set(true)]
    → [HttpClient GET /products]
        ↓ sucesso
    → [products.set(data)]
    → [loading.set(false)]
    → [mat-table re-renderiza via @for no dataSource]

        ↓ erro
    → [error.set(mensagem)]
    → [loading.set(false)]
    → [Template exibe bloco de erro com botão "Tentar novamente"]

[Clique "Tentar novamente"]
    → [ProductService.loadProducts()]   ← mesmo fluxo

[Clique "Editar" na linha]
    → [Router.navigate(['/products', id, 'edit'])]

[Clique "Excluir" na linha]
    → [Navega para /sdd2 da feature delete — fora do escopo desta spec]

[Clique "Novo Produto"]
    → [Router.navigate(['/products/new'])]
```

## Tratamento de Erros

| Cenário                     | Capturado em                | Comportamento                                        |
| --------------------------- | --------------------------- | ---------------------------------------------------- |
| HTTP 4xx / 5xx              | `ProductService.catchError` | `error` signal recebe mensagem; `products` fica `[]` |
| Timeout / Rede indisponível | `ProductService.catchError` | Mesmo comportamento do HTTP error                    |
| Array vazio retornado       | Template (`@if`)            | Exibe bloco "Nenhum produto encontrado"              |

## Estratégia de Testes

| Camada     | Ferramenta                       | O que testar                                                     |
| ---------- | -------------------------------- | ---------------------------------------------------------------- |
| Serviço    | Vitest + `HttpTestingController` | `loadProducts()` em sucesso, erro HTTP, estado de loading        |
| Componente | Vitest + Angular Testing Library | Renderização da tabela, loader, estado de erro, retry, navegação |

**Casos de teste do serviço (`product.service.spec.ts`):**

- Deve iniciar com `products = []`, `loading = false`, `error = null`
- Ao chamar `loadProducts()`, deve setar `loading = true` imediatamente
- Em resposta 200, deve popular `products` e setar `loading = false`
- Em resposta 4xx/5xx, deve setar `error` com mensagem e `loading = false`

**Casos de teste do componente (`product-list.component.spec.ts`):**

- Deve exibir `mat-spinner` quando `loading = true`
- Deve exibir N linhas na tabela quando `products` tem N itens
- Deve exibir bloco de erro quando `error` não é `null`
- Ao clicar em "Tentar novamente", deve chamar `loadProducts()` novamente
- Deve exibir "Nenhum produto encontrado" quando `products = []` e `loading = false`
- Ao clicar em "Editar", deve navegar para `/products/:id/edit`
- Ao clicar em "Novo Produto", deve navegar para `/products/new`

## Acceptance Criteria Técnicos

- [ ] TAC01: `ProductService.loadProducts()` seta `loading = true` antes da requisição e `false` após (sucesso ou erro)
- [ ] TAC02: Em resposta 200 com array, `products` signal contém os dados retornados
- [ ] TAC03: Em resposta de erro HTTP, `error` signal contém mensagem não-nula e `products` permanece `[]`
- [ ] TAC04: O template exibe `mat-spinner` enquanto `loading = true`
- [ ] TAC05: O template renderiza uma linha na `mat-table` por produto em `products`
- [ ] TAC06: Cada linha exibe imagem, título, categoria, preço formatado e avaliação (`rating.rate`)
- [ ] TAC07: Cada linha exibe botões de ação "Editar" e "Excluir" com `aria-label`
- [ ] TAC08: O template exibe bloco de erro com botão "Tentar novamente" quando `error !== null`
- [ ] TAC09: O template exibe mensagem "Nenhum produto encontrado" quando `products = []` e `loading = false` e `error = null`
- [ ] TAC10: O botão "Novo Produto" na toolbar navega para `/products/new`
- [ ] TAC11: O botão "Editar" navega para `/products/:id/edit`

## Decisões Técnicas e Trade-offs

| Decisão                                                 | Alternativa considerada         | Motivo da escolha                                                                    |
| ------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| `signal()` no serviço para estado                       | `BehaviorSubject` / NgRx        | Mais simples, idiomático Angular 17+, sem boilerplate                                |
| `mat-table` com array direto (não `MatTableDataSource`) | `MatTableDataSource`            | Sem necessidade de sort/filter/paginator nesta feature; pode ser migrado futuramente |
| `catchError` + `of([])` no serviço                      | Propagar erro para o componente | Centraliza tratamento; componente só lê signals                                      |
| Standalone component                                    | NgModule                        | Padrão Angular 17+; reduz boilerplate                                                |
| Rota lazy via `loadComponent`                           | Eager loading                   | Melhor performance inicial; padrão moderno Angular                                   |

## Tarefas de Implementação

> Será detalhado na etapa sdd3-criar-tasks.

- [ ] T01: Criar `environment.ts` com `apiUrl`
- [ ] T02: Criar `product.model.ts` com interfaces `Product` e `Rating`
- [ ] T03: Implementar `ProductService` com signals e `loadProducts()`
- [ ] T04: Escrever testes do `ProductService`
- [ ] T05: Configurar rota `/products` em `app.routes.ts`
- [ ] T06: Implementar `ProductListComponent` (template + lógica)
- [ ] T07: Escrever testes do `ProductListComponent`
