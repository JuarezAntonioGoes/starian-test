import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.detectChanges();
  });

  it('should render the spinner', () => {
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not render message when not provided', () => {
    const msg = fixture.nativeElement.querySelector('.spinner-message');
    expect(msg).toBeNull();
  });

  it('should render message when provided', () => {
    fixture.componentRef.setInput('message', 'Carregando...');
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.spinner-message');
    expect(msg?.textContent?.trim()).toBe('Carregando...');
  });

  it('should use default diameter of 48', () => {
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });
});
