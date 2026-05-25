import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductPayload } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  private readonly http = inject(HttpClient);

  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly savedProduct = signal<Product | null>(null);

  createProduct(payload: ProductPayload): void {
    this.saving.set(true);
    this.saveError.set(null);
    this.savedProduct.set(null);
    this.http
      .post<Product>(`${environment.apiUrl}/products`, payload)
      .pipe(
        catchError(() => {
          this.saveError.set('Não foi possível salvar o produto. Tente novamente.');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((data) => this.savedProduct.set(data));
  }

  updateProduct(id: number, payload: ProductPayload): void {
    this.saving.set(true);
    this.saveError.set(null);
    this.savedProduct.set(null);
    this.http
      .put<Product>(`${environment.apiUrl}/products/${id}`, payload)
      .pipe(
        catchError(() => {
          this.saveError.set('Não foi possível salvar o produto. Tente novamente.');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((data) => this.savedProduct.set(data));
  }

  reset(): void {
    this.saving.set(false);
    this.saveError.set(null);
    this.savedProduct.set(null);
  }
}
