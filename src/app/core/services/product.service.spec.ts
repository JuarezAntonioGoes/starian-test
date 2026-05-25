import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product, ProductPayload } from '../models/product.model';
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

  describe('getProduct()', () => {
    it('should make GET /products/:id', () => {
      let result: Product | undefined;
      service.getProduct(1).subscribe((p) => (result = p));
      const req = httpController.expectOne('https://fakestoreapi.com/products/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts[0]);
      expect(result).toEqual(mockProducts[0]);
    });
  });

  describe('createProduct()', () => {
    const payload: ProductPayload = {
      title: 'New Product',
      price: 29.99,
      description: 'A brand new product',
      category: 'new-category',
      image: 'https://example.com/new.png',
    };

    it('should make POST /products with correct payload', () => {
      let result: Product | undefined;
      service.createProduct(payload).subscribe((p) => (result = p));
      const req = httpController.expectOne('https://fakestoreapi.com/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ id: 21, ...payload, rating: { rate: 0, count: 0 } });
      expect(result?.id).toBe(21);
      expect(result?.title).toBe('New Product');
    });
  });

  describe('updateProduct()', () => {
    const payload: ProductPayload = {
      title: 'Updated Product',
      price: 49.99,
      description: 'An updated product',
      category: 'updated-category',
      image: 'https://example.com/updated.png',
    };

    it('should make PUT /products/:id with correct payload', () => {
      let result: Product | undefined;
      service.updateProduct(1, payload).subscribe((p) => (result = p));
      const req = httpController.expectOne('https://fakestoreapi.com/products/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush({ id: 1, ...payload, rating: { rate: 4.5, count: 100 } });
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Updated Product');
    });
  });
});
