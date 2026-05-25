---
title: 'Tech Spec — Painel Administrativo de Produtos (Criação)'
type: tech-spec
scope: 'products'
prd: 'wip/prds/products/product-create.prd.md'
status: approved
created: '2026-05-24'
updated: '2026-05-24'
commit: ''
---

## Visão Geral Técnica

A feature implementa a tela `/products/new`. O `ProductService` existente é estendido com o método `createProduct()`. O `ProductCreateComponent` standalone usa `ReactiveFormsModule` para o formulário, consome o serviço via `inject()` e gerencia estado de submissão com `signal()`. Em sucesso, navega para `/products` via `Router`.

## Arquitetura e Estrutura de Arquivos

```
src/app/
  core/
    services/
      product.service.ts        ← adicionar createProduct()
      product.service.spec.ts   ← adicionar testes de createProduct()
  features/
    products/
      product-form/
        product-form.component.ts    ← componente de formulário reutilizável (create + edit)
        product-form.component.html
        product-form.component.scss
        product-form.component.spec.ts
  app.routes.ts                 ← adicionar rota /products/new
```

> **Decisão:** criar um `ProductFormComponent` único e reutilizável para criação e edição, recebendo dados iniciais opcionais via `@Input`. Isso evita duplicação de template e lógica de validação.

## Modelos de Dados

```typescript
// Já existe em src/app/core/models/product.model.ts
// Adicionar payload de criação/edição:

export interface ProductPayload {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
```

## Contratos de API

| Operação      | Método | Endpoint                            | Payload          | Resposta  |
| ------------- | ------ | ----------------------------------- | ---------------- | --------- |
| Criar produto | POST   | `https://fakestoreapi.com/products` | `ProductPayload` | `Product` |

## Componentes

### `ProductFormComponent`

| Item              | Detalhe                                                                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Seletor**       | `app-product-form`                                                                                                                                                                              |
| **Rota (create)** | `/products/new`                                                                                                                                                                                 |
| **Inputs**        | `initialData?: Product` — se fornecido, pré-preenche o formulário (modo edição)                                                                                                                 |
| **Outputs**       | Nenhum — navegação feita internamente pelo componente                                                                                                                                           |
| **Dependências**  | `ProductService`, `Router`, `ActivatedRoute`, `ReactiveFormsModule`, `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatIconModule`, `MatToolbarModule`, `MatProgressSpinnerModule` |

**Campos do formulário:**

| Campo         | Tipo       | Validações              |
| ------------- | ---------- | ----------------------- |
| `title`       | text       | required, minLength(3)  |
| `price`       | number     | required, min(0.01)     |
| `description` | textarea   | required, minLength(10) |
| `category`    | text       | required                |
| `image`       | text (URL) | required                |

**Estado interno do componente:**

| Signal      | Tipo                     | Descrição                                              |
| ----------- | ------------------------ | ------------------------------------------------------ |
| `saving`    | `Signal<boolean>`        | `true` enquanto a requisição POST estiver em andamento |
| `saveError` | `Signal<string \| null>` | Mensagem de erro da requisição ou `null`               |

## Serviços — extensão do `ProductService`

| Método          | Assinatura                                       | Descrição                      |
| --------------- | ------------------------------------------------ | ------------------------------ |
| `createProduct` | `(payload: ProductPayload): Observable<Product>` | `POST /products` com o payload |

> Retorna `Observable` em vez de gerenciar estado interno — o componente controla `saving` e `saveError` localmente via signals.

```typescript
createProduct(payload: ProductPayload): Observable<Product> {
  return this.http.post<Product>(`${environment.apiUrl}/products`, payload);
}
```

## Fluxo de Dados

```
[Usuário acessa /products/new]
    → [ProductFormComponent renderiza formulário vazio]

[Usuário preenche e clica "Salvar"]
    → [Formulário inválido?] → botão desabilitado, nada acontece
    → [Formulário válido]
    → [saving.set(true), saveError.set(null)]
    → [ProductService.createProduct(payload)]
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

| Cenário             | Comportamento                                                  |
| ------------------- | -------------------------------------------------------------- |
| Formulário inválido | Botão "Salvar" desabilitado; `mat-error` visível em cada campo |
| HTTP 4xx / 5xx      | `saveError` recebe mensagem; formulário permanece preenchido   |
| Rede indisponível   | Mesmo comportamento do HTTP error                              |

## Estratégia de Testes

| Camada     | Ferramenta                       | O que testar                                               |
| ---------- | -------------------------------- | ---------------------------------------------------------- |
| Serviço    | Vitest + `HttpTestingController` | `createProduct()` em sucesso e erro HTTP                   |
| Componente | Vitest + Angular Testing Library | Renderização do form, validações, loading, erro, navegação |

**Casos de teste do serviço:**

- `createProduct()` faz `POST /products` com o payload correto
- Em resposta 200, retorna o produto criado

**Casos de teste do componente:**

- Renderiza formulário com 5 campos vazios em modo criação
- Botão "Salvar" desabilitado com formulário inválido
- Exibe `mat-error` em campos inválidos após interação (touched)
- Em submit válido, chama `createProduct()` com os dados do formulário
- Exibe loading no botão durante a requisição (`saving = true`)
- Em sucesso, navega para `/products`
- Em erro, exibe `saveError` sem navegar
- Botão "Cancelar" navega para `/products`

## Acceptance Criteria Técnicos

- [ ] TAC01: `ProductService.createProduct()` faz `POST /products` com o payload correto
- [ ] TAC02: Formulário renderiza com 5 campos em modo criação
- [ ] TAC03: Botão "Salvar" está `disabled` quando formulário é inválido
- [ ] TAC04: `mat-error` aparece para cada campo inválido após ser tocado
- [ ] TAC05: Submit chama `createProduct()` com os valores do formulário
- [ ] TAC06: `saving` signal seta `true` durante a requisição e `false` após
- [ ] TAC07: Em sucesso, `Router.navigate(['/products'])` é chamado
- [ ] TAC08: Em erro HTTP, `saveError` contém mensagem e não navega
- [ ] TAC09: Botão "Cancelar" chama `Router.navigate(['/products'])`

## Decisões Técnicas e Trade-offs

| Decisão                                         | Alternativa considerada         | Motivo da escolha                                            |
| ----------------------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| `ProductFormComponent` único para create e edit | Dois componentes separados      | Evita duplicação de template e validações                    |
| `saving`/`saveError` signals no componente      | No serviço                      | Estado de UI local ao formulário; serviço retorna Observable |
| `ReactiveFormsModule`                           | `FormsModule` (template-driven) | Controle mais preciso de validação e estado do formulário    |

## Tarefas de Implementação

> Será detalhado na etapa sdd3-criar-tasks.

- [ ] T01: Adicionar `ProductPayload` ao `product.model.ts`
- [ ] T02: Adicionar `createProduct()` ao `ProductService`
- [ ] T03: Escrever testes de `createProduct()` no `ProductService`
- [ ] T04: Implementar `ProductFormComponent` (modo criação)
- [ ] T05: Configurar rota `/products/new` em `app.routes.ts`
- [ ] T06: Escrever testes do `ProductFormComponent` (modo criação)
