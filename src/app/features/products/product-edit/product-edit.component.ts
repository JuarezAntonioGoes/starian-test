import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ProductGetService } from '../../../core/services/product-get.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-edit',
  imports: [MatButtonModule, LoadingSpinnerComponent, ProductFormComponent],
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly getService = inject(ProductGetService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.getService.error.set('ID de produto inválido.');
      return;
    }
    this.getService.loadProduct(id);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
