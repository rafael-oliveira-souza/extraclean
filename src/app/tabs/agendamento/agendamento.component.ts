import { Component } from '@angular/core';
import { CalendarioComponent } from '../../components/calendario/calendario.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MomentInput } from 'moment';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button'
import { NumerosComponent } from '../../components/numeros/numeros.component';
import { CepService } from '../../services/cep.service';
import { CepDTO } from '../../domains/dtos/CepDTO';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NotificacaoService } from '../../services/notificacao.service';
import { ProfissionalService } from '../../services/profissional.service';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';

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
    NumerosComponent,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask(),
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent {
  public readonly VALOR_PADRAO_METRO = 2.0;
  public diasAgendados: Array<MomentInput> = [];
  public isLinear = false;
  public formComodos!: FormGroup;
  public formArea!: FormGroup;
  public formUltimaLimpeza!: FormGroup;
  public formPets!: FormGroup;
  public formCep!: FormGroup;
  public formTipoLimpeza!: FormGroup;
  public isEditable = true;
  public exibeCep = false;
  public isDetalhada = false;
  public metragemMin = 25;
  public metragemMax = 9999;
  public valorMetro = this.VALOR_PADRAO_METRO;
  public profissionais: Array<ProfissionalDTO> = [];

  constructor(private _formBuilder: FormBuilder, private _cepService: CepService,
    private _notificacaoService: NotificacaoService, private _profissionalService: ProfissionalService) {
    this.buildForm();
  }

  public agendar() {
    console.log(this.diasAgendados)
  }

  public getCep(cep: string) {
    this.exibeCep = false;
    if (cep) {
      this._cepService.getCep(cep)
        .subscribe((cepRecuperado: CepDTO) => {
          if (cepRecuperado['erro']) {
            this._notificacaoService.alerta("Cep não encontrado!");
          } else {
            this.exibeCep = true;
            this.formCep.controls['bairro'].setValue(cepRecuperado.bairro);
            this.formCep.controls['localidade'].setValue(cepRecuperado.localidade);
            this.formCep.controls['logradouro'].setValue(cepRecuperado.logradouro);
            this.formCep.controls['uf'].setValue(cepRecuperado.uf);
          }
        });
    }
  }

  public getDiasAgendados(diasAgendados: Array<MomentInput>) {
    this.diasAgendados = diasAgendados;
  }

  public desabilitarAgendamento() {
    return this.diasAgendados.length <= 0;
  }

  public isDisabled(controlName: string) {
    // return !this.firstFormGroup.controls[controlName].value;
    return true;
  }

  public resetar(stepper: MatStepper) {
    this.buildForm();
    stepper.reset()
  }

  private buildForm() {
    this.formComodos = this._formBuilder.group({
      cozinha: [0, Validators.min(0)],
      quarto: [0, Validators.min(1)],
      banheiro: [0, Validators.min(1)],
      sala: [0, Validators.min(1)],
      areaServico: [0, Validators.min(0)],
    });
    this.formArea = this._formBuilder.group({
      valor: ['', [Validators.required, Validators.min(this.metragemMin), Validators.max(this.metragemMax)]]
    });
    this.formUltimaLimpeza = this._formBuilder.group({
      valor: ['', Validators.required]
    });
    this.formPets = this._formBuilder.group({
      valor: ['', Validators.required]
    });
    this.formTipoLimpeza = this._formBuilder.group({
      valor: ['', Validators.required]
    });

    this.formCep = this._formBuilder.group({
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      numero: ['', Validators.required],
      logradouro: new FormControl({ value: '', disabled: true }, Validators.required),
      complemento: new FormControl({ value: '', disabled: false }),
      bairro: new FormControl({ value: '', disabled: true }, Validators.required),
      localidade: new FormControl({ value: '', disabled: true }, Validators.required),
      uf: new FormControl({ value: '', disabled: true }, Validators.required)
    });

    this.formCep.valueChanges.subscribe(cep => {
      if (this.formCep.controls['cep'].invalid) {
        this.exibeCep = false;
      }
    });

    this.formTipoLimpeza.valueChanges.subscribe(value => {
      if (this.formTipoLimpeza.controls['valor'].valid && this.profissionais.length == 0) {
        this.recuperarProfissionais();
      }
    });

    this.formArea.valueChanges.subscribe(value => {
      if (this.formArea.controls['valor'].valid) {
        this.calcularValorPorMetro(this.formArea.controls['valor'].value);
      }
    });
  }

  public calcularValorPorMetro(metragem: number) {
    this.valorMetro = this.VALOR_PADRAO_METRO;
    let metragemCalculada = metragem;
    while (metragemCalculada > this.metragemMin && this.valorMetro >= 1.5) {
      metragemCalculada -= this.metragemMin;
      this.valorMetro -= 0.1;
    }
  }

  public recuperarProfissionais() {
    this._profissionalService.get()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = prof;
      });
  }

  isLimpezaDetalhada() {
    return this.formTipoLimpeza.controls['valor'].value == "2";
  }

  isLimpezaExpressa() {
    return this.formTipoLimpeza.controls['valor'].value == "1";
  }
}
