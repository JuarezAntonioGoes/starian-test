import { Component, Input, OnInit, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../core/models/product.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ProductFormService } from '../../../core/services/product-form.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @Input() initialData?: Product;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly formService = inject(ProductFormService);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    image: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.formService.savedProduct() !== null) {
        const msg = this.isEditMode
          ? 'Produto atualizado com sucesso!'
          : 'Produto criado com sucesso!';
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
        this.router.navigate(['/products']);
      }
    });

    effect(() => {
      const err = this.formService.saveError();
      if (err) this.snackBar.open(err, 'Fechar', { duration: 4000 });
    });
  }

  get isEditMode(): boolean {
    return !!this.initialData;
  }

  ngOnInit(): void {
    this.formService.reset();
    if (this.initialData) {
      this.form.patchValue({
        title: this.initialData.title,
        price: this.initialData.price,
        description: this.initialData.description,
        category: this.initialData.category,
        image: this.initialData.image,
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as {
      title: string;
      price: number;
      description: string;
      category: string;
      image: string;
    };
    if (this.isEditMode) {
      this.formService.updateProduct(this.initialData!.id, payload);
    } else {
      this.formService.createProduct(payload);
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
