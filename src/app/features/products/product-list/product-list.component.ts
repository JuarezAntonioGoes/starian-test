import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductListService } from '../../../core/services/product-list.service';
import { ProductDeleteButtonComponent } from './product-delete-button/product-delete-button.component';

@Component({
  selector: 'app-product-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    ProductDeleteButtonComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly router = inject(Router);
  readonly productService = inject(ProductListService);

  readonly displayedColumns = ['image', 'title', 'category', 'price', 'rating', 'actions'];

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  navigateToNew(): void {
    this.router.navigate(['/products/new']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/products', id, 'edit']);
  }
}
