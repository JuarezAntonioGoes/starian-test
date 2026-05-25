import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DeleteDialogData {
  productName: string;
}

@Component({
  selector: 'app-product-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './product-delete-dialog.component.html',
})
export class ProductDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ProductDeleteDialogComponent>);
  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
