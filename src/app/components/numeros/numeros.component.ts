import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-numeros',
  standalone: true,
  imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, CommonModule],
  templateUrl: './numeros.component.html',
  styleUrl: './numeros.component.scss'
})
export class NumerosComponent {
  @Input('valor')
  public valor: number = 0;

  @Input('largura')
  public largura: string = '100%';

  @Input('color')
  public color: string = '#5555c0';

  @Input('label')
  public label: string = '';

  @Input('disabled')
  public disabled: boolean = false;

  @Input('required')
  public required: boolean = false;

  @Input('min')
  public min: number | null = null;

  @Input('max')
  public max: number | null = null;

  @Input('formController')
  public formController!: AbstractControl<any, any>;

  constructor() {
    if (this.formController) {
      this.disabled = this.formController.disabled;
      this.required = this.formController.hasValidator(Validators.required);
    }
  }

  public calcularComodos(novoValor: number) {
    let valorCalculado = this.formController ? this.formController.value : this.valor;
    valorCalculado += novoValor;

    this.atualizarValor(valorCalculado);
  }

  public atualizarValor(valorCalculado = this.valor) {
    if (this.min != null && valorCalculado < this.min) {
      valorCalculado = this.min;
    }

    if (this.max != null && valorCalculado > this.max) {
      valorCalculado = this.max;
    }

    this.valor = valorCalculado;
    if (this.formController) {
      this.formController.setValue(valorCalculado);
    }
  }
}
