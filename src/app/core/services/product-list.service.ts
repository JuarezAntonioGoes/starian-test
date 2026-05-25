import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Subject, catchError, finalize, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductListService {
  private readonly http = inject(HttpClient);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly deletingProductIds = signal<Set<number>>(new Set());
  readonly deleteError$ = new Subject<string>();

  deleteProduct(id: number): void {
    this.deletingProductIds.update((ids) => new Set(ids).add(id));
    this.http
      .delete<Product>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        finalize(() =>
          this.deletingProductIds.update((ids) => {
            const next = new Set(ids);
            next.delete(id);
            return next;
          }),
        ),
      )
      .subscribe({
        next: () => this.products.update((list) => list.filter((p) => p.id !== id)),
        error: () => this.deleteError$.next('Não foi possível excluir o produto. Tente novamente.'),
      });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<Product[]>(`${environment.apiUrl}/products`)
      .pipe(
        catchError(() => {
          this.error.set('Não foi possível carregar os produtos. Tente novamente.');
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data) => this.products.set(data));
  }
}
