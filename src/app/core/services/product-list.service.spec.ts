import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';
import { ProductListService } from './product-list.service';

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

describe('ProductListService', () => {
  let service: ProductListService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductListService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

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

  it('should reset error to null on subsequent successful call', () => {
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

  describe('deleteProduct()', () => {
    beforeEach(() => {
      service.products.set([...mockProducts]);
    });

    it('should make DELETE /products/:id', () => {
      service.deleteProduct(1);
      const req = httpController.expectOne('https://fakestoreapi.com/products/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockProducts[0]);
    });

    it('should add id to deletingProductIds during request and remove after success', () => {
      service.deleteProduct(1);
      expect(service.deletingProductIds().has(1)).toBe(true);
      httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProducts[0]);
      expect(service.deletingProductIds().has(1)).toBe(false);
    });

    it('should remove product from products signal on success', () => {
      service.deleteProduct(1);
      httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProducts[0]);
      expect(service.products().find((p) => p.id === 1)).toBeUndefined();
      expect(service.products().length).toBe(1);
    });

    it('should remove id from deletingProductIds after HTTP error', () => {
      service.deleteProduct(1);
      httpController
        .expectOne('https://fakestoreapi.com/products/1')
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.deletingProductIds().has(1)).toBe(false);
    });

    it('should emit error message via deleteError$ on HTTP error', () => {
      let errorMsg: string | undefined;
      service.deleteError$.subscribe((msg) => (errorMsg = msg));
      service.deleteProduct(1);
      httpController
        .expectOne('https://fakestoreapi.com/products/1')
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(errorMsg).toBe('Não foi possível excluir o produto. Tente novamente.');
    });

    it('should support concurrent deletions of different products', () => {
      service.deleteProduct(1);
      service.deleteProduct(2);
      expect(service.deletingProductIds().has(1)).toBe(true);
      expect(service.deletingProductIds().has(2)).toBe(true);
      httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProducts[0]);
      expect(service.deletingProductIds().has(1)).toBe(false);
      expect(service.deletingProductIds().has(2)).toBe(true);
      httpController.expectOne('https://fakestoreapi.com/products/2').flush(mockProducts[1]);
      expect(service.deletingProductIds().size).toBe(0);
    });

    it('should not remove other products on success', () => {
      service.deleteProduct(1);
      httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProducts[0]);
      expect(service.products()[0]).toEqual(mockProducts[1]);
    });
  });
});
