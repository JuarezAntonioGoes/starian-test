import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductGetService } from '../../../core/services/product-get.service';
import { ProductFormService } from '../../../core/services/product-form.service';
import { ProductEditComponent } from './product-edit.component';

const mockProduct: Product = {
  id: 1,
  title: 'Existing Product',
  price: 49.99,
  description: 'An existing product description',
  category: 'electronics',
  image: 'https://example.com/img.png',
  rating: { rate: 4.0, count: 200 },
};

describe('ProductEditComponent', () => {
  let fixture: ComponentFixture<ProductEditComponent>;
  let component: ProductEditComponent;
  let router: Router;

  const productMock = signal<Product | null>(null);
  const loadingMock = signal(false);
  const errorMock = signal<string | null>(null);
  const loadProductMock = vi.fn();

  const mockGetService = {
    product: productMock,
    loading: loadingMock,
    error: errorMock,
    loadProduct: loadProductMock,
  };

  const mockFormService = {
    saving: signal(false),
    saveError: signal<string | null>(null),
    savedProduct: signal<Product | null>(null),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    reset: vi.fn(),
  };

  function createComponent(paramId: string = '1') {
    productMock.set(null);
    loadingMock.set(false);
    errorMock.set(null);
    loadProductMock.mockClear();

    return TestBed.configureTestingModule({
      imports: [ProductEditComponent],
      providers: [
        provideRouter([{ path: 'products', redirectTo: '' }]),
        { provide: ProductGetService, useValue: mockGetService },
        { provide: ProductFormService, useValue: mockFormService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => paramId } } },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductEditComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
      });
  }

  it('should display spinner while loading', async () => {
    await createComponent('1');
    loadingMock.set(true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).not.toBeNull();
  });

  it('should call loadProduct with correct id on init', async () => {
    await createComponent('1');
    fixture.detectChanges();
    expect(loadProductMock).toHaveBeenCalledWith(1);
  });

  it('should render app-product-form after successful load', async () => {
    await createComponent('1');
    fixture.detectChanges();
    productMock.set(mockProduct);
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('app-product-form');
    expect(form).not.toBeNull();
  });

  it('should display error message and back button on load error', async () => {
    await createComponent('1');
    errorMock.set('Erro ao carregar.');
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('.error-message');
    const backBtn = fixture.nativeElement.querySelector('button');
    expect(errorEl).not.toBeNull();
    expect(backBtn).not.toBeNull();
  });

  it('should set error immediately for invalid id without calling loadProduct', async () => {
    await createComponent('abc');
    fixture.detectChanges();
    expect(loadProductMock).not.toHaveBeenCalled();
    expect(mockGetService.error()).not.toBeNull();
  });

  it('should navigate to /products when back button is clicked on error', async () => {
    await createComponent('1');
    errorMock.set('Erro ao carregar.');
    fixture.detectChanges();
    const spy = vi.spyOn(router, 'navigate');
    const backBtn = fixture.nativeElement.querySelector('button');
    backBtn.click();
    expect(spy).toHaveBeenCalledWith(['/products']);
  });
});
