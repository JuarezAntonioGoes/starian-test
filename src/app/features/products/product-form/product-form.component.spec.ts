import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductFormService } from '../../../core/services/product-form.service';
import { ProductFormComponent } from './product-form.component';

const mockProduct: Product = {
  id: 1,
  title: 'Existing Product',
  price: 49.99,
  description: 'An existing product description long enough',
  category: 'electronics',
  image: 'https://example.com/img.png',
  rating: { rate: 4.0, count: 200 },
};

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;
  let router: Router;

  const savingMock = signal(false);
  const saveErrorMock = signal<string | null>(null);
  const savedProductMock = signal<Product | null>(null);
  const createProductMock = vi.fn();
  const updateProductMock = vi.fn();
  const resetMock = vi.fn();

  const mockFormService = {
    saving: savingMock,
    saveError: saveErrorMock,
    savedProduct: savedProductMock,
    createProduct: createProductMock,
    updateProduct: updateProductMock,
    reset: resetMock,
  };

  beforeEach(async () => {
    savingMock.set(false);
    saveErrorMock.set(null);
    savedProductMock.set(null);
    createProductMock.mockClear();
    updateProductMock.mockClear();
    resetMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideRouter([{ path: 'products', component: ProductFormComponent }]),
        { provide: ProductFormService, useValue: mockFormService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  describe('modo criação (sem initialData)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render form with 5 empty fields', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input, textarea');
      expect(inputs.length).toBe(5);
      expect(component.form.value.title).toBe('');
      expect(component.form.value.price).toBeNull();
    });

    it('should display "Novo Produto" in toolbar', () => {
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
      expect(toolbar.textContent).toContain('Novo Produto');
    });

    it('should disable save button when form is invalid', () => {
      const saveBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveBtn.disabled).toBe(true);
    });

    it('should show mat-error for required fields after touched', () => {
      component.form.controls.title.markAsTouched();
      fixture.detectChanges();
      const error = fixture.nativeElement.querySelector('mat-error');
      expect(error).not.toBeNull();
      expect(error.textContent).toContain('obrigatório');
    });

    it('should call createProduct() with form values on valid submit', () => {
      component.form.setValue({
        title: 'Valid Product',
        price: 9.99,
        description: 'Valid description here',
        category: 'test',
        image: 'https://example.com/img.png',
      });
      component.onSubmit();
      expect(createProductMock).toHaveBeenCalledOnce();
      expect(createProductMock).toHaveBeenCalledWith({
        title: 'Valid Product',
        price: 9.99,
        description: 'Valid description here',
        category: 'test',
        image: 'https://example.com/img.png',
      });
    });

    it('should disable save button when saving is true', () => {
      component.form.setValue({
        title: 'Valid Product',
        price: 9.99,
        description: 'Valid description here',
        category: 'test',
        image: 'https://example.com/img.png',
      });
      savingMock.set(true);
      fixture.detectChanges();
      const saveBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveBtn.disabled).toBe(true);
    });

    it('should navigate to /products when savedProduct signal emits', async () => {
      fixture.detectChanges();
      const spy = vi.spyOn(router, 'navigate');
      savedProductMock.set(mockProduct);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(spy).toHaveBeenCalledWith(['/products']);
    });

    it('should display saveError when saveError signal is set', () => {
      saveErrorMock.set('Erro ao salvar.');
      fixture.detectChanges();
      const errorEl = fixture.nativeElement.querySelector('.save-error');
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent).toContain('Erro ao salvar.');
    });

    it('should navigate to /products when cancel is clicked', () => {
      const spy = vi.spyOn(router, 'navigate');
      const cancelBtn = fixture.nativeElement.querySelector('button[type="button"]');
      cancelBtn.click();
      expect(spy).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('modo edição (com initialData)', () => {
    beforeEach(() => {
      component.initialData = mockProduct;
      fixture.detectChanges();
    });

    it('should pre-fill form fields with initialData', () => {
      expect(component.form.value.title).toBe('Existing Product');
      expect(component.form.value.price).toBe(49.99);
      expect(component.form.value.category).toBe('electronics');
    });

    it('should display "Editar Produto" in toolbar', () => {
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
      expect(toolbar.textContent).toContain('Editar Produto');
    });

    it('should call updateProduct() on valid submit', () => {
      component.onSubmit();
      expect(updateProductMock).toHaveBeenCalledOnce();
      expect(updateProductMock).toHaveBeenCalledWith(1, {
        title: 'Existing Product',
        price: 49.99,
        description: 'An existing product description long enough',
        category: 'electronics',
        image: 'https://example.com/img.png',
      });
    });

    it('should navigate to /products when savedProduct emits after update', async () => {
      fixture.detectChanges();
      const spy = vi.spyOn(router, 'navigate');
      savedProductMock.set(mockProduct);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(spy).toHaveBeenCalledWith(['/products']);
    });
  });
});
