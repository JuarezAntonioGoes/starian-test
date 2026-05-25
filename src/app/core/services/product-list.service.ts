import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductListService {
  private readonly http = inject(HttpClient);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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
