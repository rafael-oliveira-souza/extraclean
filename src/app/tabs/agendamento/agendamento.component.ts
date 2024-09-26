import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { PagamentoComponent } from '../../components/pagamento/pagamento.component';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { Rota } from '../../app.routes';
import { CepComponent } from '../../components/cep/cep.component';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { ItensLimpezaComponent } from '../../components/itens-limpeza/itens-limpeza.component';

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
    MatCheckboxModule,
    NgxMaskPipe,
    CepComponent,
    ItensLimpezaComponent,
    PagamentoComponent,
  ],
  providers: [
    provideNgxMask(),
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent implements OnInit {
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
  public habilitaStep: boolean[] = [false, false, false, false, true, true];
  public endereco = new EnderecoDTO();

  constructor(private _authService: AutenticacaoService, private _router: Router,
    private _formBuilder: FormBuilder, private _cepService: CepService,
    private _notificacaoService: NotificacaoService, private _profissionalService: ProfissionalService,
    private _agendamentoService: AgendamentoService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.montarAgendamentoEmCache();
  }

  public montarAgendamentoEmCache() {
    this.dadosAgendamento = LocalStorageUtils.getAgendamento();
  }

  public getEndereco(endereco: EnderecoDTO) {
    this.endereco = endereco;
  }

  public agendar() {
    this._authService.validarUsuario(false, true);
    this.dadosAgendamento.endereco = EnderecoUtils.montarEndereco(this.endereco);
    this.dadosAgendamento.tipoLimpeza = this.formTipoLimpeza.controls['valor'].value;
    LocalStorageUtils.setAgendamento(this.dadosAgendamento);

    this._agendamentoService.agendar(this.dadosAgendamento)
      .subscribe((result: PagamentoMpDTO) => {
        window.open(result.url, '_blank');
        this._notificacaoService.alerta(MensagemEnum.AGENDAMENTO_CONCLUIDO_SUCESSO);
        LocalStorageUtils.removeItem(LocalStorageUtils.USUARIO_CACHE_CARRINHO_AGENDAMENTO);
        this.dadosAgendamento = new AgendamentoDTO();
        this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
        // const documentWidth = document.documentElement.clientWidth;
        // const documentHeight = document.documentElement.clientHeight;
        // let dialogRef = this.dialog.open(PagamentoComponent, {
        //   minWidth: `${documentWidth * 0.8}px`,
        //   maxWidth: `${documentWidth * 0.9}px`,
        //   minHeight: `90vh`,
        //   maxHeight: `95vh`,
        //   data: { pagamento: null, url: result.url }
        // });
      },
        (error) => this._notificacaoService.erro(error));
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
            this.exibirCep(cepRecuperado);
          }
        });
    }
  }

  public exibirCep(cepRecuperado: EnderecoDTO) {
    this.exibeCep = true;
    this.formCep.controls['bairro'].setValue(cepRecuperado?.bairro);
    this.formCep.controls['localidade'].setValue(cepRecuperado?.localidade);
    this.formCep.controls['logradouro'].setValue(cepRecuperado?.logradouro);
    this.formCep.controls['uf'].setValue(cepRecuperado?.uf);
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
      valor: ['1', Validators.required]
    });

    this.formTipoLimpeza.valueChanges.subscribe(value => {
      const tipoLimpezaControl = this.formTipoLimpeza.controls['valor'];
      if (tipoLimpezaControl.valid && tipoLimpezaControl.value == '1' && this.profissionais.length == 0) {
        this.recuperarProfissionais();
      }
    });
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

    if (this.dadosAgendamento.profissionais.length > 0) {
      this.profissionais.forEach(prof => {
        this.dadosAgendamento.profissionais.forEach(profissionalSelecionado => {
          if (profissionalSelecionado == prof.id) {
            profissional = prof;
            return;
          }
        });
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
