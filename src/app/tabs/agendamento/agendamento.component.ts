import { Component } from '@angular/core';
import { CalendarioComponent } from '../../components/calendario/calendario.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MomentInput } from 'moment';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button'
import { CdkStep, StepperOptions } from '@angular/cdk/stepper';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CalendarioComponent,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent {
  public firstFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.buildForm();
  }

  public diasAgendados: Array<MomentInput> = [];
  public corProgresso: string = "#23C5F6";
  public valorProgresso: number = 0;
  public ultimaLimpeza: number = 0;
  public metragem: number = 0;
  public isLinear = false;

  public agendar() {
    console.log(this.diasAgendados)
  }

  public getDiasAgendados(diasAgendados: Array<MomentInput>) {
    this.diasAgendados = diasAgendados;
  }

  public desabilitarAgendamento() {
    return this.diasAgendados.length <= 0;
  }

  public isDisabled(controlName: string) {
    return !this.firstFormGroup.controls[controlName].value;
  }

  public resetar(stepper: MatStepper) {
    this.buildForm();
    stepper.reset()
  }

  private buildForm() {
    this.firstFormGroup = this._formBuilder.group({
      first: [null, Validators.required],
      second: [null, Validators.required],
    });
  }

  public atualizarProgresso() {
    this.valorProgresso = 0;
    if (this.metragem) {
      this.valorProgresso += 10;
    }

    if (this.ultimaLimpeza) {
      this.valorProgresso += 10;
    }
  }
}
