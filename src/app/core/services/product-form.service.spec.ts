import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product, ProductPayload } from '../models/product.model';
import { ProductFormService } from './product-form.service';

const mockPayload: ProductPayload = {
  title: 'New Product',
  price: 29.99,
  description: 'A brand new product',
  category: 'electronics',
  image: 'https://example.com/img.png',
};

const mockProduct: Product = {
  id: 21,
  ...mockPayload,
  rating: { rate: 0, count: 0 },
};

describe('ProductFormService', () => {
  let service: ProductFormService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductFormService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should have initial state with saving false, saveError null, savedProduct null', () => {
    expect(service.saving()).toBe(false);
    expect(service.saveError()).toBeNull();
    expect(service.savedProduct()).toBeNull();
  });

  describe('createProduct()', () => {
    it('should make POST /products with correct payload', () => {
      service.createProduct(mockPayload);
      const req = httpController.expectOne('https://fakestoreapi.com/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPayload);
      req.flush(mockProduct);
    });

    it('should set saving to true during request and false after success', () => {
      service.createProduct(mockPayload);
      expect(service.saving()).toBe(true);
      httpController.expectOne('https://fakestoreapi.com/products').flush(mockProduct);
      expect(service.saving()).toBe(false);
    });

    it('should set savedProduct on success', () => {
      service.createProduct(mockPayload);
      httpController.expectOne('https://fakestoreapi.com/products').flush(mockProduct);
      expect(service.savedProduct()).toEqual(mockProduct);
    });

    it('should set saveError and saving to false on HTTP error', () => {
      service.createProduct(mockPayload);
      httpController
        .expectOne('https://fakestoreapi.com/products')
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.saveError()).toBe('Não foi possível salvar o produto. Tente novamente.');
      expect(service.saving()).toBe(false);
      expect(service.savedProduct()).toBeNull();
    });
  });

  describe('updateProduct()', () => {
    it('should make PUT /products/:id with correct payload', () => {
      service.updateProduct(1, mockPayload);
      const req = httpController.expectOne('https://fakestoreapi.com/products/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockPayload);
      req.flush({ ...mockProduct, id: 1 });
    });

    it('should set saving to true during request and false after success', () => {
      service.updateProduct(1, mockPayload);
      expect(service.saving()).toBe(true);
      httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProduct);
      expect(service.saving()).toBe(false);
    });

    it('should set savedProduct on success', () => {
      service.updateProduct(1, mockPayload);
      httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProduct);
      expect(service.savedProduct()).toEqual(mockProduct);
    });

    it('should set saveError and saving to false on HTTP error', () => {
      service.updateProduct(1, mockPayload);
      httpController
        .expectOne('https://fakestoreapi.com/products/1')
        .flush('Error', { status: 500, statusText: 'Server Error' });
      expect(service.saveError()).toBe('Não foi possível salvar o produto. Tente novamente.');
      expect(service.saving()).toBe(false);
    });
  });

  describe('reset()', () => {
    it('should clear saving, saveError and savedProduct', () => {
      service.createProduct(mockPayload);
      httpController.expectOne('https://fakestoreapi.com/products').flush(mockProduct);
      expect(service.savedProduct()).not.toBeNull();
      service.reset();
      expect(service.saving()).toBe(false);
      expect(service.saveError()).toBeNull();
      expect(service.savedProduct()).toBeNull();
    });
  });
});
