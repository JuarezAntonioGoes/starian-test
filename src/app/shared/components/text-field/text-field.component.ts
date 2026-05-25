import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface FieldError {
  key: string;
  message: string;
}

const DEFAULT_ERROR_MESSAGES: Record<string, string> = {
  required: 'Campo obrigatório.',
  minlength: 'Valor muito curto.',
  maxlength: 'Valor muito longo.',
  min: 'Valor abaixo do mínimo permitido.',
  max: 'Valor acima do máximo permitido.',
  email: 'E-mail inválido.',
  pattern: 'Formato inválido.',
};

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class TextFieldComponent implements ControlValueAccessor, OnInit {
  label = input.required<string>();
  placeholder = input('');
  type = input<'text' | 'number' | 'textarea'>('text');
  errors = input<FieldError[]>([]);
  rows = input(4);

  readonly control = new FormControl<string | number | null>(null);

  private readonly ngControl = inject(NgControl);
  private readonly destroyRef = inject(DestroyRef);
  private _onTouched: () => void = () => {};

  constructor() {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.ngControl.control) {
      this.control.setValidators(this.ngControl.control.validator);
      this.control.setAsyncValidators(this.ngControl.control.asyncValidator);
      this.control.updateValueAndValidity({ emitEvent: false });
    }
  }

  get isRequired(): boolean {
    return this.ngControl.control?.hasValidator(Validators.required) ?? false;
  }

  writeValue(value: string | number | null): void {
    this.control.setValue(value ?? null, { emitEvent: false });
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    disabled ? this.control.disable() : this.control.enable();
  }

  onBlur(): void {
    this.control.markAsTouched();
    this.ngControl.control?.markAsTouched();
    this._onTouched();
  }

  get activeError(): string | null {
    if (!this.control.invalid || !this.control.touched) return null;
    const errorKey = Object.keys(this.control.errors ?? {})[0];
    if (!errorKey) return null;
    const override = this.errors().find((e) => e.key === errorKey);
    return override?.message ?? DEFAULT_ERROR_MESSAGES[errorKey] ?? 'Valor inválido.';
  }
}
