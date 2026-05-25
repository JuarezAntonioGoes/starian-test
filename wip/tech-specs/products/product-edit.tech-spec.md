---
title: 'Tech Spec — Painel Administrativo de Produtos (Edição)'
type: tech-spec
scope: 'products'
prd: 'wip/prds/products/product-edit.prd.md'
status: approved
created: '2026-05-24'
updated: '2026-05-24'
commit: ''
---

## Visão Geral Técnica

A feature reutiliza o `ProductFormComponent` criado pela feature de criação, passando `initialData` com o produto carregado. O `ProductService` é estendido com `getProduct()` e `updateProduct()`. O `ProductEditComponent` é um wrapper de roteamento que lê o `id` da URL via `ActivatedRoute`, carrega o produto e delega a renderização para `ProductFormComponent`.

## Arquitetura e Estrutura de Arquivos

```
src/app/
  core/
    services/
      product.service.ts        ← adicionar getProduct() e updateProduct()
      product.service.spec.ts   ← adicionar testes dos novos métodos
  features/
    products/
      product-edit/
        product-edit.component.ts    ← wrapper: lê id, carrega produto, passa para ProductFormComponent
        product-edit.component.html
        product-edit.component.spec.ts
      product-form/                  ← já existe da feature de criação
        product-form.component.ts    ← adicionar suporte a modo edição (initialData + updateProduct)
        product-form.component.spec.ts ← adicionar testes de modo edição
  app.routes.ts                 ← adicionar rota /products/:id/edit
```

## Modelos de Dados

Reutiliza `Product`, `Rating` e `ProductPayload` já definidos em `product.model.ts`.

## Contratos de API

| Operação          | Método | Endpoint                                | Payload          | Resposta  |
| ----------------- | ------ | --------------------------------------- | ---------------- | --------- |
| Buscar produto    | GET    | `https://fakestoreapi.com/products/:id` | —                | `Product` |
| Atualizar produto | PUT    | `https://fakestoreapi.com/products/:id` | `ProductPayload` | `Product` |

## Componentes

### `ProductEditComponent`

| Item                 | Detalhe                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **Seletor**          | `app-product-edit`                                                                                        |
| **Rota**             | `/products/:id/edit`                                                                                      |
| **Responsabilidade** | Ler `id` da rota, carregar produto via `getProduct()`, exibir loading/erro/form                           |
| **Dependências**     | `ProductService`, `ActivatedRoute`, `ProductFormComponent`, `MatProgressSpinnerModule`, `MatButtonModule` |

**Estado interno:**

| Signal           | Tipo                      | Descrição                                                |
| ---------------- | ------------------------- | -------------------------------------------------------- |
| `product`        | `Signal<Product \| null>` | Produto carregado ou `null`                              |
| `loadingProduct` | `Signal<boolean>`         | `true` enquanto `GET /products/:id` estiver em andamento |
| `loadError`      | `Signal<string \| null>`  | Mensagem de erro do carregamento ou `null`               |

### `ProductFormComponent` — extensão para modo edição

Recebe `@Input() initialData?: Product`. Quando fornecido:

- Pré-preenche os campos com os valores do produto
- Usa `updateProduct(id, payload)` ao invés de `createProduct(payload)`

| Input         | Tipo       | Descrição                                                 |
| ------------- | ---------- | --------------------------------------------------------- |
| `initialData` | `Product?` | Se fornecido, ativa modo edição com dados pré-preenchidos |

## Serviços — extensão do `ProductService`

| Método          | Assinatura                                                   | Descrição                       |
| --------------- | ------------------------------------------------------------ | ------------------------------- |
| `getProduct`    | `(id: number): Observable<Product>`                          | `GET /products/:id`             |
| `updateProduct` | `(id: number, payload: ProductPayload): Observable<Product>` | `PUT /products/:id` com payload |

```typescript
getProduct(id: number): Observable<Product> {
  return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
}

updateProduct(id: number, payload: ProductPayload): Observable<Product> {
  return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, payload);
}
```

## Fluxo de Dados

```
[Usuário acessa /products/:id/edit]
    → [ProductEditComponent lê id da ActivatedRoute]
    → [loadingProduct.set(true)]
    → [ProductService.getProduct(id)]
        ↓ sucesso
    → [product.set(data), loadingProduct.set(false)]
    → [Renderiza <app-product-form [initialData]="product()">]

        ↓ erro (404 ou HTTP error)
    → [loadError.set(mensagem), loadingProduct.set(false)]
    → [Template exibe erro com botão "Voltar"]

[Usuário edita campos e clica "Salvar"]
    → [Formulário inválido?] → botão desabilitado
    → [Formulário válido]
    → [saving.set(true), saveError.set(null)]
    → [ProductService.updateProduct(id, payload)]
        ↓ sucesso
    → [saving.set(false)]
    → [Router.navigate(['/products'])]

        ↓ erro
    → [saving.set(false)]
    → [saveError.set(mensagem)]
    → [Template exibe erro, permanece na página]

[Usuário clica "Cancelar"]
    → [Router.navigate(['/products'])]
```

## Tratamento de Erros

| Cenário                     | Comportamento                                                   |
| --------------------------- | --------------------------------------------------------------- |
| GET /products/:id — 404     | `loadError` com mensagem "Produto não encontrado"; botão Voltar |
| GET /products/:id — 5xx     | `loadError` com mensagem genérica; botão Voltar                 |
| PUT /products/:id — 4xx/5xx | `saveError` no formulário; permanece na página                  |
| ID inválido na URL (NaN)    | `loadError` imediato sem requisição                             |

## Estratégia de Testes

| Camada               | Ferramenta                       | O que testar                                                   |
| -------------------- | -------------------------------- | -------------------------------------------------------------- |
| Serviço              | Vitest + `HttpTestingController` | `getProduct()` e `updateProduct()` em sucesso e erro           |
| ProductEditComponent | Vitest                           | Loading, erro de carregamento, renderiza form com dados        |
| ProductFormComponent | Vitest                           | Pré-preenchimento em modo edição, submit chama `updateProduct` |

**Casos de teste do serviço:**

- `getProduct(1)` faz `GET /products/1`
- `updateProduct(1, payload)` faz `PUT /products/1` com payload correto
- Em erro HTTP, os Observables propagam o erro

**Casos de teste do `ProductEditComponent`:**

- Exibe spinner durante carregamento
- Em sucesso, renderiza `app-product-form` com `initialData`
- Em erro de carregamento, exibe mensagem e botão "Voltar"

**Casos de teste do `ProductFormComponent` (modo edição):**

- Campos pré-preenchidos com `initialData`
- Submit chama `updateProduct()` com os valores do formulário
- Em sucesso, navega para `/products`

## Acceptance Criteria Técnicos

- [ ] TAC01: `ProductService.getProduct(id)` faz `GET /products/:id`
- [ ] TAC02: `ProductService.updateProduct(id, payload)` faz `PUT /products/:id` com payload correto
- [ ] TAC03: `ProductEditComponent` exibe spinner enquanto `loadingProduct = true`
- [ ] TAC04: `ProductEditComponent` renderiza `app-product-form` com `initialData` após carregamento
- [ ] TAC05: `ProductEditComponent` exibe erro com botão "Voltar" quando `loadError !== null`
- [ ] TAC06: `ProductFormComponent` pré-preenche campos com `initialData` em modo edição
- [ ] TAC07: Submit em modo edição chama `updateProduct()` com os valores do formulário
- [ ] TAC08: Em sucesso do update, `Router.navigate(['/products'])` é chamado
- [ ] TAC09: Em erro do update, `saveError` contém mensagem e não navega

## Decisões Técnicas e Trade-offs

| Decisão                                                                   | Alternativa considerada                     | Motivo da escolha                                        |
| ------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| `ProductEditComponent` como wrapper + `ProductFormComponent` reutilizável | Componente de edição com formulário próprio | Evita duplicação; formulário testado uma vez             |
| `getProduct` e `updateProduct` retornam `Observable`                      | signals no serviço                          | Estado de loading/erro é local ao `ProductEditComponent` |
| Detectar modo pelo `@Input() initialData`                                 | Rota separada com componente separado       | Mais simples; formulário não precisa conhecer a rota     |

## Tarefas de Implementação

> Será detalhado na etapa sdd3-criar-tasks.

- [ ] T01: Adicionar `getProduct()` e `updateProduct()` ao `ProductService`
- [ ] T02: Escrever testes de `getProduct()` e `updateProduct()`
- [ ] T03: Estender `ProductFormComponent` com suporte a `initialData` e modo edição
- [ ] T04: Escrever testes do `ProductFormComponent` no modo edição
- [ ] T05: Implementar `ProductEditComponent`
- [ ] T06: Escrever testes do `ProductEditComponent`
- [ ] T07: Configurar rota `/products/:id/edit` em `app.routes.ts`
