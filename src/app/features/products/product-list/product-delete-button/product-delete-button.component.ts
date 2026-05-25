import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../../core/models/product.model';
import { ProductListService } from '../../../../core/services/product-list.service';
import {
  DeleteDialogData,
  ProductDeleteDialogComponent,
} from '../product-delete-dialog/product-delete-dialog.component';

@Component({
  selector: 'app-product-delete-button',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <button
      mat-icon-button
      color="warn"
      aria-label="Excluir produto"
      [disabled]="isDeleting"
      (click)="openDeleteDialog()"
    >
      <mat-icon>delete</mat-icon>
    </button>
  `,
})
export class ProductDeleteButtonComponent implements OnInit {
  @Input({ required: true }) product!: Product;

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  readonly productService = inject(ProductListService);

  get isDeleting(): boolean {
    return this.productService.deletingProductIds().has(this.product.id);
  }

  ngOnInit(): void {
    this.productService.deleteError$.subscribe((msg) =>
      this.snackBar.open(msg, 'Fechar', { duration: 4000 }),
    );
  }

  openDeleteDialog(): void {
    const ref = this.dialog.open<ProductDeleteDialogComponent, DeleteDialogData, boolean>(
      ProductDeleteDialogComponent,
      { data: { productName: this.product.title }, width: '400px' },
    );
    ref.afterClosed().subscribe((confirmed) => this.onDeleteConfirmed(confirmed));
  }

  onDeleteConfirmed(confirmed: boolean | undefined): void {
    if (confirmed) this.productService.deleteProduct(this.product.id);
  }
}
