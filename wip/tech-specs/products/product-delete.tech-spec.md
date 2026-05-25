---
title: 'Tech Spec — Excluir Produto'
scope: products
prd: 'wip/prds/products/product-delete.prd.md'
status: approved
created: '2026-05-25'
updated: '2026-05-25'
---

## Visão Técnica

Adicionar método `deleteProduct()` ao `ProductListService` (que já gerencia o array `products`). O `ProductListComponent` exibe um dialog de confirmação via `MatDialog` e, após confirmação, chama o serviço. O produto é removido do signal `products` localmente após sucesso. Erros são exibidos via `MatSnackBar`.

## Arquitetura

```
ProductListComponent
  → clique "Excluir"
  → MatDialog (ProductDeleteDialogComponent)
      → "Confirmar" → ProductListService.deleteProduct(id)
          → DELETE /products/:id
          → sucesso: products.update(remove item)
          → erro: MatSnackBar.open(mensagem)
```

## Novos Arquivos

| Arquivo                                                                                                | Descrição             |
| ------------------------------------------------------------------------------------------------------ | --------------------- |
| `src/app/features/products/product-list/product-delete-dialog/product-delete-dialog.component.ts`      | Dialog de confirmação |
| `src/app/features/products/product-list/product-delete-dialog/product-delete-dialog.component.html`    | Template do dialog    |
| `src/app/features/products/product-list/product-delete-dialog/product-delete-dialog.component.spec.ts` | Testes do dialog      |

## Arquivos Modificados

| Arquivo                                                                 | Alteração                                                  |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/app/core/services/product-list.service.ts`                         | Adicionar `deleteProduct(id)` e signal `deleting`          |
| `src/app/core/services/product-list.service.spec.ts`                    | Testes de `deleteProduct()`                                |
| `src/app/features/products/product-list/product-list.component.ts`      | Injetar `MatDialog`, `MatSnackBar`, chamar `deleteProduct` |
| `src/app/features/products/product-list/product-list.component.html`    | Desabilitar botão excluir durante `deleting`               |
| `src/app/features/products/product-list/product-list.component.spec.ts` | Testes do fluxo de exclusão                                |

## Modelo de Dados

Nenhuma alteração em `product.model.ts`. A API retorna o produto deletado mas não é utilizado — apenas o `id` passado é removido do array local.

## API Contract

```
DELETE https://fakestoreapi.com/products/:id
Response 200: Product (objeto do produto deletado)
Response 4xx/5xx: erro HTTP
```

## Serviço — ProductListService

```typescript
readonly deleting = signal<number | null>(null); // id sendo deletado

deleteProduct(id: number): void {
  this.deleting.set(id);
  this.http.delete<Product>(`${environment.apiUrl}/products/${id}`)
    .pipe(finalize(() => this.deleting.set(null)))
    .subscribe({
      next: () => this.products.update(list => list.filter(p => p.id !== id)),
      error: () => { /* erro propagado via callback */ }
    });
}
```

> O serviço **não** gerencia o snackbar — o componente passa um callback de erro ou o serviço emite via `Subject<string>`. Optamos por um `Subject` público `deleteError$` para desacoplar.

```typescript
readonly deleteError$ = new Subject<string>();

deleteProduct(id: number): void {
  this.deleting.set(id);
  this.http.delete<Product>(`${environment.apiUrl}/products/${id}`)
    .pipe(finalize(() => this.deleting.set(null)))
    .subscribe({
      next: () => this.products.update(list => list.filter(p => p.id !== id)),
      error: () => this.deleteError$.next('Não foi possível excluir o produto. Tente novamente.'),
    });
}
```

## Componente — ProductDeleteDialogComponent

```typescript
// Data injetada via MAT_DIALOG_DATA
export interface DeleteDialogData {
  productName: string;
}
// Retorna: true (confirmou) | false/undefined (cancelou)
```

- Botão "Cancelar" → `dialogRef.close(false)`
- Botão "Confirmar" → `dialogRef.close(true)`

## Componente — ProductListComponent

```typescript
// Injeta MatDialog e MatSnackBar
openDeleteDialog(product: Product): void {
  const ref = this.dialog.open(ProductDeleteDialogComponent, {
    data: { productName: product.title },
    width: '400px',
  });
  ref.afterClosed().subscribe(confirmed => {
    if (!confirmed) return;
    this.productService.deleteProduct(product.id);
  });
}

// No ngOnInit, subscreve deleteError$
ngOnInit(): void {
  this.productService.loadProducts();
  this.productService.deleteError$.subscribe(msg =>
    this.snackBar.open(msg, 'Fechar', { duration: 4000 })
  );
}
```

## Template — product-list.component.html

Botão excluir com `[disabled]`:

```html
<button
  mat-icon-button
  color="warn"
  [disabled]="productService.deleting() === product.id"
  (click)="openDeleteDialog(product)"
>
  <mat-icon>delete</mat-icon>
</button>
```

## Estratégia de Testes

### ProductListService

- `deleteProduct()` faz `DELETE /products/:id`
- Em sucesso, remove o produto do signal `products`
- Em erro, emite mensagem via `deleteError$`
- `deleting` signal: `id` durante request, `null` após

### ProductDeleteDialogComponent

- Renderiza o nome do produto passado via `MAT_DIALOG_DATA`
- "Cancelar" fecha com `false`
- "Confirmar" fecha com `true`

### ProductListComponent

- Clique em "Excluir" abre dialog
- Ao confirmar, chama `deleteProduct(id)`
- Ao cancelar, não chama `deleteProduct`
- `deleteError$` exibe snackbar

## Critérios de Aceitação Técnicos

- **TAC01** — `ProductListService.deleteProduct(id)` faz `DELETE /products/:id`
- **TAC02** — Sucesso: produto removido de `products` signal sem reload
- **TAC03** — Erro: `deleteError$` emite mensagem
- **TAC04** — `deleting` signal contém o `id` durante a requisição e `null` após
- **TAC05** — Dialog exibe nome do produto
- **TAC06** — "Cancelar" não chama a API
- **TAC07** — Botão excluir desabilitado enquanto `deleting() === product.id`
