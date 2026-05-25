import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductGetService {
  private readonly http = inject(HttpClient);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.product.set(null);
    this.http
      .get<Product>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        catchError(() => {
          this.error.set('Não foi possível carregar o produto. Tente novamente.');
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data) => this.product.set(data));
  }
}
