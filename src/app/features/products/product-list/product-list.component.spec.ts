import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductListService } from '../../../core/services/product-list.service';
import { ProductListComponent } from './product-list.component';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product A',
    price: 9.99,
    description: 'Description A',
    category: 'category-a',
    image: 'https://example.com/a.png',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Test Product B',
    price: 19.99,
    description: 'Description B',
    category: 'category-b',
    image: 'https://example.com/b.png',
    rating: { rate: 3.0, count: 50 },
  },
];

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;
  let router: Router;

  const productsMock = signal<Product[]>([]);
  const loadingMock = signal(false);
  const errorMock = signal<string | null>(null);
  const loadProductsMock = vi.fn();
  const deleteErrorSubject = new Subject<string>();

  const mockProductService = {
    products: productsMock,
    loading: loadingMock,
    error: errorMock,
    deletingProductIds: signal<Set<number>>(new Set()),
    deleteError$: deleteErrorSubject,
    loadProducts: loadProductsMock,
    deleteProduct: vi.fn(),
  };

  afterEach(() => {
    loadProductsMock.mockClear();
  });

  beforeEach(async () => {
    productsMock.set([]);
    loadingMock.set(false);
    errorMock.set(null);

    const routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ProductListService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should call loadProducts() on init', () => {
    const spy = vi.spyOn(mockProductService, 'loadProducts');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should display spinner when loading is true', () => {
    loadingMock.set(true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).not.toBeNull();
  });

  it('should not display table when loading is true', () => {
    loadingMock.set(true);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeNull();
  });

  it('should display N rows for N products', () => {
    productsMock.set(mockProducts);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(mockProducts.length);
  });

  it('should display image, title, category, price and rating for each row', () => {
    productsMock.set([mockProducts[0]]);
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');
    const cellTexts = Array.from(cells).map((c: unknown) => (c as HTMLElement).textContent?.trim());
    expect(cellTexts).toContain('Test Product A');
    expect(cellTexts).toContain('category-a');
    expect(cellTexts).toContain('$ 9.99');
    expect(cellTexts).toContain('4.5 / 5');
  });

  it('should display edit and delete buttons with aria-label for each row', () => {
    productsMock.set([mockProducts[0]]);
    fixture.detectChanges();
    const editBtn = fixture.nativeElement.querySelector('[aria-label="Editar produto"]');
    const deleteBtn = fixture.nativeElement.querySelector('[aria-label="Excluir produto"]');
    expect(editBtn).not.toBeNull();
    expect(deleteBtn).not.toBeNull();
  });

  it('should display error block when error is not null', () => {
    errorMock.set('Erro ao carregar.');
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('.error-message');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('Erro ao carregar.');
  });

  it('should call loadProducts() when "Tentar novamente" is clicked', () => {
    errorMock.set('Erro ao carregar.');
    fixture.detectChanges();
    const retryBtn = fixture.nativeElement.querySelector('.state-container button');
    loadProductsMock.mockClear();
    retryBtn.click();
    expect(loadProductsMock).toHaveBeenCalledOnce();
  });

  it('should display empty state message when products is empty', () => {
    productsMock.set([]);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Nenhum produto encontrado');
  });

  it('should navigate to /products/new when "Novo Produto" is clicked', async () => {
    productsMock.set(mockProducts);
    fixture.detectChanges();
    const spy = vi.spyOn(router, 'navigate');
    const newBtn = fixture.nativeElement.querySelector('button[mat-raised-button]');
    newBtn.click();
    expect(spy).toHaveBeenCalledWith(['/products/new']);
  });

  it('should navigate to /products/:id/edit when edit button is clicked', async () => {
    productsMock.set([mockProducts[0]]);
    fixture.detectChanges();
    const spy = vi.spyOn(router, 'navigate');
    const editBtn = fixture.nativeElement.querySelector('[aria-label="Editar produto"]');
    editBtn.click();
    expect(spy).toHaveBeenCalledWith(['/products', 1, 'edit']);
  });
});
