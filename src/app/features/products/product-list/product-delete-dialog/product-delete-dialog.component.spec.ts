import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';

describe('ProductDeleteDialogComponent', () => {
  let fixture: ComponentFixture<ProductDeleteDialogComponent>;
  let component: ProductDeleteDialogComponent;

  const dialogRefMock = { close: vi.fn() };

  beforeEach(async () => {
    dialogRefMock.close.mockClear();

    await TestBed.configureTestingModule({
      imports: [ProductDeleteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { productName: 'Test Product' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the product name in the dialog', () => {
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Test Product');
  });

  it('should close with false when cancel is clicked', () => {
    component.cancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when confirm is clicked', () => {
    component.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should render Cancelar and Excluir buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const labels = Array.from(buttons).map((b) => (b as Element).textContent?.trim());
    expect(labels).toContain('Cancelar');
    expect(labels).toContain('Excluir');
  });
});
