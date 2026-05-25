import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product',
    price: 9.99,
    description: 'A test product',
    category: 'test',
    image: 'https://example.com/img.png',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Another Product',
    price: 19.99,
    description: 'Another test product',
    category: 'test',
    image: 'https://example.com/img2.png',
    rating: { rate: 3.0, count: 50 },
  },
];

describe('ProductService', () => {
  let service: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should have initial state with empty products, loading false and error null', () => {
    expect(service.products()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should set loading to true immediately when loadProducts() is called', () => {
    service.loadProducts();
    expect(service.loading()).toBe(true);
    httpController.expectOne('https://fakestoreapi.com/products').flush([]);
  });

  it('should populate products and set loading to false on success', () => {
    service.loadProducts();
    httpController.expectOne('https://fakestoreapi.com/products').flush(mockProducts);

    expect(service.products()).toEqual(mockProducts);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should set error message and loading to false on HTTP error', () => {
    service.loadProducts();
    httpController
      .expectOne('https://fakestoreapi.com/products')
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(service.error()).toBe('Não foi possível carregar os produtos. Tente novamente.');
    expect(service.products()).toEqual([]);
    expect(service.loading()).toBe(false);
  });

  it('should reset error to null on subsequent successful loadProducts() call', () => {
    service.loadProducts();
    httpController
      .expectOne('https://fakestoreapi.com/products')
      .flush('Error', { status: 500, statusText: 'Server Error' });
    expect(service.error()).not.toBeNull();

    service.loadProducts();
    httpController.expectOne('https://fakestoreapi.com/products').flush(mockProducts);

    expect(service.error()).toBeNull();
    expect(service.products()).toEqual(mockProducts);
  });
});
