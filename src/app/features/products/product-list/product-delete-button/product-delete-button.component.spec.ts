import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Product } from '../../../../core/models/product.model';
import { ProductListService } from '../../../../core/services/product-list.service';
import { ProductDeleteButtonComponent } from './product-delete-button.component';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product A',
  price: 9.99,
  description: 'Description A',
  category: 'category-a',
  image: 'https://example.com/a.png',
  rating: { rate: 4.5, count: 100 },
};

describe('ProductDeleteButtonComponent', () => {
  let fixture: ComponentFixture<ProductDeleteButtonComponent>;
  let component: ProductDeleteButtonComponent;

  const deletingProductIdsMock = signal<Set<number>>(new Set());
  const deleteErrorSubject = new Subject<string>();
  const deleteProductMock = vi.fn();

  const mockProductService = {
    deletingProductIds: deletingProductIdsMock,
    deleteError$: deleteErrorSubject,
    deleteProduct: deleteProductMock,
    products: signal<Product[]>([]),
    loading: signal(false),
    error: signal<string | null>(null),
    loadProducts: vi.fn(),
  };

  const snackBarMock = { open: vi.fn() };

  afterEach(() => {
    deleteProductMock.mockClear();
    snackBarMock.open.mockClear();
    deletingProductIdsMock.set(new Set());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDeleteButtonComponent],
      providers: [
        { provide: ProductListService, useValue: mockProductService },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDeleteButtonComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should render a delete button with correct aria-label', () => {
    const btn = fixture.nativeElement.querySelector('[aria-label="Excluir produto"]');
    expect(btn).not.toBeNull();
  });

  it('should disable button when product id is in deletingProductIds', () => {
    deletingProductIdsMock.set(new Set([1]));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });

  it('should NOT disable button when a different product id is deleting', () => {
    deletingProductIdsMock.set(new Set([2]));
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(false);
  });

  it('should call deleteProduct(id) when onDeleteConfirmed is called with true', () => {
    component.onDeleteConfirmed(true);
    expect(deleteProductMock).toHaveBeenCalledWith(1);
  });

  it('should NOT call deleteProduct when onDeleteConfirmed is called with false', () => {
    component.onDeleteConfirmed(false);
    expect(deleteProductMock).not.toHaveBeenCalled();
  });

  it('should NOT call deleteProduct when onDeleteConfirmed is called with undefined', () => {
    component.onDeleteConfirmed(undefined);
    expect(deleteProductMock).not.toHaveBeenCalled();
  });

  it('should open snackbar when deleteError$ emits', () => {
    deleteErrorSubject.next('Não foi possível excluir o produto. Tente novamente.');
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Não foi possível excluir o produto. Tente novamente.',
      'Fechar',
      { duration: 4000 },
    );
  });
});
