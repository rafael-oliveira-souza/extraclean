import { Component } from '@angular/core';
import { CalendarioComponent } from '../../components/calendario/calendario.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NotificacaoService } from '../../services/notificacao.service';
import { ProfissionalService } from '../../services/profissional.service';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { PipeModule } from '../../pipes/pipe.module';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { AgendamentoService } from '../../services/agendamento.service';
import { EnderecoDTO } from '../../domains/dtos/EnderecoDTO';
import { EnderecoUtils } from '../../utils/EnderecoUtils';
import { CalculoUtils } from '../../utils/CalculoUtils';

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
    PipeModule,
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
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly METRAGEM_MAX = AgendamentoConstantes.METRAGEM_MAX;
  public readonly METRAGEM_MIN = AgendamentoConstantes.METRAGEM_MIN;
  public readonly MAX_PERCENTUAL = AgendamentoConstantes.MAX_PERCENTUAL;
  public readonly PERCENTUAL_DESCONTO = AgendamentoConstantes.PERCENTUAL_DESCONTO;

  public dadosAgendamento: AgendamentoDTO = new AgendamentoDTO();
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
  public valorMetro = AgendamentoConstantes.VALOR_PADRAO_METRO;
  public profissionais: Array<ProfissionalDTO> = [];
  public profissional = null;


  constructor(private _formBuilder: FormBuilder, private _cepService: CepService,
    private _notificacaoService: NotificacaoService, private _profissionalService: ProfissionalService,
    private _agendamentoService: AgendamentoService) {
    this.buildForm();
  }

  public agendar() {
    let endereco = new EnderecoDTO();
    endereco.bairro = this.formCep.controls['bairro'].value;
    endereco.numero = this.formCep.controls['numero'].value;
    endereco.logradouro = this.formCep.controls['logradouro'].value;
    endereco.complemento = this.formCep.controls['complemento'].value;
    endereco.localidade = this.formCep.controls['localidade'].value;
    endereco.cep = this.formCep.controls['cep'].value;
    endereco.uf = this.formCep.controls['uf'].value;
    this.dadosAgendamento.endereco = EnderecoUtils.montarEndereco(endereco);

    this.dadosAgendamento.tipoLimpeza = this.formTipoLimpeza.controls['valor'].value;
    this._agendamentoService.agendar(this.dadosAgendamento)
      .subscribe(result => {
        console.log(result)
      })
  }

  public limparDiasSelecionados() {

  }

  public getCep(cep: string) {
    this.exibeCep = false;
    if (cep) {
      this._cepService.getCep(cep)
        .subscribe((cepRecuperado: EnderecoDTO) => {
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

  public getDadosAgendamento(dadosAgendamento: AgendamentoDTO) {
    this.dadosAgendamento = dadosAgendamento;
  }

  public desabilitarAgendamento() {
    return this.dadosAgendamento.isSemAgendamento();
  }

  public isDisabled(controlName: string) {
    // return !this.firstFormGroup.controls[controlName].value;
    return true;
  }

  public avancarOuVoltar(stepper: MatStepper, isProximo: boolean) {
    if (isProximo) {
      stepper.next();
    } else {
      stepper.previous();
    }

    if (!this.profissionais || this.profissionais.length <= 0) {
      this.recuperarProfissionais();
    }
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
      valor: ['', [Validators.required, Validators.min(AgendamentoConstantes.METRAGEM_MIN), Validators.max(AgendamentoConstantes.METRAGEM_MAX)]]
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
      const tipoLimpezaControl = this.formTipoLimpeza.controls['valor'];
      if (tipoLimpezaControl.valid && tipoLimpezaControl.value == '1' && this.profissionais.length == 0) {
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
    this.valorMetro = AgendamentoConstantes.VALOR_PADRAO_METRO;
    // let metragemCalculada = metragem;
    // while (metragemCalculada > this.METRAGEM_MIN * 2 && this.valorMetro >= 1.5) {
    //   metragemCalculada -= this.METRAGEM_MIN * 2;
    //   this.valorMetro -= 0.1;
    // }
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

  public recuperarProfissional(): ProfissionalDTO {
    let profissional = ProfissionalDTO.empty();

    if (this.dadosAgendamento.profissionalSelecionado != 0) {
      this.profissionais.forEach(prof => {
        if (this.dadosAgendamento.profissionalSelecionado == prof.id) {
          profissional = prof;
          return;
        }
      });
    }

    return profissional;
  }

  public definirDisposicaoClasse() {
    // return this.isXs() ? "disposicao-botoes-sem-margem" : "disposicao-botoes";
    return "disposicao-botoes-sem-margem";
  }

  public isXs() {
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }
}
