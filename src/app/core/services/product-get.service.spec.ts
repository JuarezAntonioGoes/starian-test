import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';
import { ProductGetService } from './product-get.service';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 9.99,
  description: 'A test product',
  category: 'test',
  image: 'https://example.com/img.png',
  rating: { rate: 4.5, count: 100 },
};

describe('ProductGetService', () => {
  let service: ProductGetService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductGetService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should have initial state with product null, loading false and error null', () => {
    expect(service.product()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should set loading to true immediately when loadProduct() is called', () => {
    service.loadProduct(1);
    expect(service.loading()).toBe(true);
    httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProduct);
  });

  it('should set product and loading to false on success', () => {
    service.loadProduct(1);
    httpController.expectOne('https://fakestoreapi.com/products/1').flush(mockProduct);
    expect(service.product()).toEqual(mockProduct);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should set error message and loading to false on HTTP error', () => {
    service.loadProduct(1);
    httpController
      .expectOne('https://fakestoreapi.com/products/1')
      .flush('Not found', { status: 404, statusText: 'Not Found' });
    expect(service.error()).toBe('Não foi possível carregar o produto. Tente novamente.');
    expect(service.product()).toBeNull();
    expect(service.loading()).toBe(false);
  });

  it('should make GET request to correct URL with given id', () => {
    service.loadProduct(42);
    const req = httpController.expectOne('https://fakestoreapi.com/products/42');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should reset product and error before each new request', () => {
    service.loadProduct(1);
    httpController
      .expectOne('https://fakestoreapi.com/products/1')
      .flush('Error', { status: 500, statusText: 'Server Error' });
    expect(service.error()).not.toBeNull();

    service.loadProduct(2);
    expect(service.error()).toBeNull();
    expect(service.product()).toBeNull();
    httpController.expectOne('https://fakestoreapi.com/products/2').flush(mockProduct);
  });
});
