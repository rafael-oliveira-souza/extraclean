import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { DateUtils } from '../../utils/DateUtils';
import moment, { MomentInput } from 'moment';
import { PipeModule } from '../../pipes/pipe.module';
import { AgendamentoService } from '../../services/agendamento.service';
import { InfoAgendamentoDTO } from '../../domains/dtos/InfoAgendamentoDTO';
import { TurnoEnum } from '../../domains/enums/TurnoEnum';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { FinalizacaoAgendamentoDTO } from '../../domains/dtos/FinalizacaoAgendamentoDTO';
import { SituacaoDiariaEnum } from '../../domains/enums/SituacaoDiariaEnum';
import { SituacaoPagamentoEnum } from '../../domains/enums/SituacaoPagamentoEnum';
import { ScrollComponent } from '../scroll/scroll.component';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { NotificacaoService } from '../../services/notificacao.service';
import { AgendamentoDiariaDTO } from '../../domains/dtos/AgendamentoDiariaDTO';
import { RegistroAgendamentoDTO } from '../../domains/dtos/RegistroAgendamentoDTO';
import { SituacaoAgendamentoEnum } from '../../domains/enums/SituacaoAgendamentoEnum';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { CodigoValorDTO } from '../../domains/dtos/CodigoValorDTO';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { MatExpansionModule } from '@angular/material/expansion';
import { TipoProfissionalEnum } from '../../domains/enums/TipoProfissionalEnum';
import { WindowsUtils } from '../../utils/WindowsUtils';

@Component({
  selector: 'app-calendario-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatGridListModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    PipeModule,
    ScrollComponent,
    AutoCompleteComponent,
    MatExpansionModule,
  ],
  templateUrl: './calendario-agendamento.component.html',
  styleUrls: ['./calendario-agendamento.component.scss']
})
export class CalendarioAgendamentoComponent implements OnInit {

  @Input('isAdm')
  public isAdm: boolean = false;

  @Input('profissional')
  public profissional: string = "";

  @Input('profissionais')
  public profissionais: ProfissionalDTO[] = [];

  public mapMat: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public mapVesp: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public map: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public proximosPeriodos: Date[] = [];
  public ultimosPeriodos: Date[] = [];
  public proximoPeriodoSelecionado: Date[] = [];
  public periodo: number = 0;
  public qtdInfo: string = "1:1";
  public infos: InfoAgendamentoDTO[] = [];
  public profissionaisAtuais: Array<CodigoValorDTO> = [];
  public turno: number = TurnoEnum.NAO_DEFINIDO;
  public periodoUnico: Date = DateUtils.newDate();
  public hoje: Date = DateUtils.newDate();
  public habilitaAlteracaoProfissional: boolean = false;
  public habilitaReagendamento: boolean = false;

  constructor(private _agendService: AgendamentoService,
    private _notificacaoService: NotificacaoService,
    private _changes: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.profissionais = this.ordenarProfissionais(this.profissionais);
    this.getProximosPeriodos();
    this.atualizarPeriodo();
  }

  public ordenarProfissionais(prof: Array<ProfissionalDTO>) {
    return prof
      .filter(profi => profi.tipo == TipoProfissionalEnum.DIARISTA)
      .sort((a1, a2) => {
        if (a1.nome < a2.nome) return -1;
        if (a1.nome > a2.nome) return 1;
        return 0;
      });
  }

  public atualizarPeriodo() {
    this.proximoPeriodoSelecionado = [];
    const dataAtual: Date = this.proximosPeriodos[this.periodo];
    if (!this.isXs()) {
      const ultimaSegunda: moment.Moment = DateUtils.toMoment(dataAtual).day(1);
      this.proximoPeriodoSelecionado.push(ultimaSegunda.toDate());
      for (let i = 0; i < 5; i++) {
        ultimaSegunda.add(1, 'day');
        this.proximoPeriodoSelecionado.push(ultimaSegunda.toDate());
      }
    } else {
      this.proximoPeriodoSelecionado.push(dataAtual);
    }

    this.mapMat = new Map();
    this.mapVesp = new Map();
    this.proximoPeriodoSelecionado.forEach(per => {
      const dataDiaria = this.formatarData(per);
      this.mapVesp.set(dataDiaria, [null]);
      this.mapMat.set(dataDiaria, [null]);
    });

    this.atualizarInfos(dataAtual);
  }

  private atualizarInfos(dataAtual: MomentInput) {
    let map = new Map<string, InfoAgendamentoDTO>();
    this._agendService
      .recuperarInfoAgendamentos(this.formatarData(dataAtual), null, null)
      .subscribe((infos: InfoAgendamentoDTO[]) => {
        infos.forEach(agend => {
          let key = agend.codigoPagamento + "_" +
            agend.dataDiaria + "_" +
            agend.idProfissional + "_" +
            agend.idCliente;

          if (map.has(key)) {
          } else {
            map.set(key, agend);
          }
        });

        this.infos = [];
        map.forEach((agend) => this.infos.push(agend));
        this.infos = this.infos.filter(agend => agend.situacao != SituacaoDiariaEnum.CANCELADA);
        if (this.profissional) {
          this.infos = this.filtrarProfissional();
        }

        this.atualizarCalendario(this.infos);
      });
  }

  public convertToList(profissionais: Set<string>) {
    return Array.from(profissionais);
  }

  private atualizarCalendario(infos: InfoAgendamentoDTO[]) {
    this.profissionaisAtuais = [];
    this.profissionais.forEach(prof => {
      this.profissionaisAtuais.push(new CodigoValorDTO(prof.id, prof.nome));
    });

    infos.forEach(info => {
      // this.profissionais.push(info.nomeDiarista);
      // if (this.profissionaisAtuais.filter(prof => prof.codigo == info.idProfissional).length == 0) {
      //   this.profissionaisAtuais.push(new CodigoValorDTO(info.idProfissional, info.nomeDiarista));
      // }

      if (info.turno == TurnoEnum.MATUTINO) {
        this.atualizarMap(info, this.mapMat);
      } else if (info.turno == TurnoEnum.VESPERTINO) {
        this.atualizarMap(info, this.mapVesp);
      } else if (info.turno == TurnoEnum.INTEGRAL) {
        this.atualizarMap(info, this.mapMat);
        this.atualizarMap(info, this.mapVesp);
      }
    });
  }

  public atualizarturno() {
    this.mapMat = new Map();
    this.mapVesp = new Map();
    this.proximoPeriodoSelecionado.forEach(per => {
      const dataDiaria = this.formatarData(per);
      this.mapVesp.set(dataDiaria, [null]);
      this.mapMat.set(dataDiaria, [null]);
    });
    const infos = this.infos.filter(info => this.turno == 0 || info.turno == this.turno);
    this.atualizarCalendario(infos);
  }

  public atualizarProfissional() {
    this.mapMat = new Map();
    this.mapVesp = new Map();
    this.proximoPeriodoSelecionado.forEach(per => {
      const dataDiaria = this.formatarData(per);
      this.mapVesp.set(dataDiaria, [null]);
      this.mapMat.set(dataDiaria, [null]);
    });
    const infos = this.filtrarProfissional();
    this.atualizarCalendario(infos);
  }

  private filtrarProfissional(): InfoAgendamentoDTO[] {
    return this.infos.filter(info => !this.profissional || info.nomeDiarista.trim().toLowerCase() == this.profissional.trim().toLowerCase());
  }

  public existeRegistro() {
    if (this.isXs()) {
      const dataAtual: string = this.formatarData(this.proximosPeriodos[this.periodo]);
      const vesp = this.mapVesp.get(dataAtual);
      const mat = this.mapMat.get(dataAtual);
      return (mat != null && mat.length > 1) || (vesp != null && vesp.length > 1);
    } else {
      const dataAtual: Date = (this.proximosPeriodos[this.periodo]);
      const filtro = DateUtils.getNextDays(dataAtual, 5).filter(per => {
        const dataAtual: string = this.formatarData(per);
        const vesp = this.mapVesp.get(dataAtual);
        const mat = this.mapMat.get(dataAtual);
        return (mat != null && mat.length > 1) || (vesp != null && vesp.length > 1);
      });

      return filtro != null && filtro.length > 0;
    }
  }

  public formatarData(data: MomentInput) {
    return DateUtils.format(data, "YYYY-MM-DD");
  }

  public getListaDiariasDia(data: Date, isMatutino: boolean): Array<InfoAgendamentoDTO | null> {
    const dataDiaria = this.formatarData(data);
    let lista = null;
    if (isMatutino) {
      lista = this.mapMat.get(dataDiaria);
    } else {
      lista = this.mapVesp.get(dataDiaria);
    }

    return lista ? lista : [];
  }

  public atualizarMap(info: InfoAgendamentoDTO, map: Map<string, Array<InfoAgendamentoDTO | null>>) {
    const chave = info.dataDiaria.toString();
    if (map.has(chave)) {
      map.get(chave)?.push(info);
    } else {
      map.set(chave, [info]);
    }
  }

  public getProximosPeriodos() {
    this.proximosPeriodos = [];

    if (this.isXs()) {
      DateUtils.getNextDays(DateUtils.newDate(), 7).forEach(data => {
        this.proximosPeriodos.push(data);
      });
    } else {
      const ultimaSegunda: moment.Moment = DateUtils.toMoment(DateUtils.newDate()).day(1);
      this.proximosPeriodos.push(ultimaSegunda.toDate());
      for (let i = 0; i < 4; i++) {
        ultimaSegunda.add(7, 'day');
        this.proximosPeriodos.push(ultimaSegunda.toDate());
      }
    }
  }

  public getLabel(data: Date) {
    if (!data) {
      return "";
    }

    if (this.isXs()) {
      return DateUtils.format(data, 'DD/MM/YYYY');
    } else {
      return DateUtils.format(data, 'DD/MM/YYYY') + " - " + DateUtils.format(DateUtils.toMoment(data).add(5, 'day'), 'DD/MM/YYYY');
    }

  }

  public isXs() {
    if (typeof window !== 'undefined') {
      return CalculoUtils.isXs(window.innerWidth);
    }

    return false;
  }

  public getDiasSemana(date: MomentInput) {
    return DateUtils.getDiasSemana(date);
  }

  public exibeBotoesModificacao(diaria: InfoAgendamentoDTO) {
    return this.exibeBotoes(diaria) && !this.isPagamentoAprovado(diaria);
  }

  public exibeBotoes(diaria: InfoAgendamentoDTO) {
    return this.isAdm && this.isPagamentoEmAberto(diaria);
  }

  public isAgendamentoNaoFinalizado(diaria: InfoAgendamentoDTO) {
    return this.isDiariaEmAdamento(diaria) && !this.isPagamentoAprovado(diaria);
  }

  public isDiariaEmAdamento(diaria: InfoAgendamentoDTO) {
    return diaria.situacao != SituacaoDiariaEnum.FINALIZADA && diaria.situacao != SituacaoDiariaEnum.CANCELADA;
  }

  public isPagamentoAprovado(diaria: InfoAgendamentoDTO) {
    return diaria.situacaoPagamento == SituacaoPagamentoEnum.APROVADO;
  }

  public isPagamentoCancelado(diaria: InfoAgendamentoDTO) {
    return diaria.situacaoPagamento == SituacaoPagamentoEnum.CANCELADO;
  }

  public isPagamentoEmAberto(diaria: InfoAgendamentoDTO) {
    return diaria.situacaoPagamento == SituacaoPagamentoEnum.CRIADO
      || diaria.situacaoPagamento == SituacaoPagamentoEnum.EM_ANALISE
      || diaria.situacaoPagamento == SituacaoPagamentoEnum.EM_PROCESSO;
  }

  public atualizarProfissionalAgendamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;
    agend.idProfissional = diaria.idProfissional;
    agend.idProfissionalAtualizado = diaria.profissionalAtualizado;
    agend.idDiaria = diaria.idDiaria;

    this._agendService
      .atualizarProfissionalAgendamento(agend)
      .subscribe((info: any) => {
        this.atualizarPeriodo();
        this._changes.detectChanges();
        this._notificacaoService.alerta(MensagemEnum.PROFISSIONAL_ATUALIZADO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public confirmarPagamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;
    agend.idDiaria = diaria.idDiaria;

    this._agendService
      .confirmarPagamento(agend)
      .subscribe((info: any) => {
        diaria.situacaoPagamento = SituacaoPagamentoEnum.APROVADO;
        this._changes.detectChanges();
        this._notificacaoService.alerta(MensagemEnum.PAGAMENTO_FINALIZADO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public copiarAgendamento(id: string): void {
    let inputData: HTMLElement | null = document.getElementById(id);

    if (inputData) {
      const info: string = "Informações do seu agendamento!! \n"
      WindowsUtils.copyText(inputData.textContent ? info + inputData.textContent.replaceAll("|", "\n") : '');
    }
  }

  public finalizarAgendamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;
    agend.idDiaria = diaria.idDiaria;

    this._agendService
      .finalizarAgendamento(agend)
      .subscribe((info: any) => {
        diaria.situacao = SituacaoDiariaEnum.FINALIZADA;
        diaria.situacaoPagamento = SituacaoPagamentoEnum.APROVADO;
        this._changes.detectChanges();
        this._notificacaoService.alerta(MensagemEnum.AGENDAMENTO_FINALIZADO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public cancelarAgendamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;
    agend.idDiaria = diaria.idDiaria;

    this._agendService
      .cancelarAgendamento(agend)
      .subscribe((info: any) => {
        diaria.situacao = SituacaoDiariaEnum.CANCELADA;
        diaria.situacaoPagamento = SituacaoPagamentoEnum.CANCELADO;
        this._changes.detectChanges();
        this._notificacaoService.alerta(MensagemEnum.AGENDAMENTO_CANCELADO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public reagendarAgendamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;
    agend.dataReagendamento = diaria.dataReagendamento;
    agend.idProfissional = diaria.idProfissional;
    agend.idDiaria = diaria.idDiaria;

    this._agendService
      .reagendarAgendamento(agend)
      .subscribe((info: any) => {
        diaria.dataReagendamento = null;
        diaria.situacao = SituacaoDiariaEnum.REAGENDADA;
        diaria.situacaoPagamento = SituacaoPagamentoEnum.EM_ANALISE;
        this.getProximosPeriodos();
        this.atualizarPeriodo();
        this._changes.detectChanges();
        this._notificacaoService.alerta(MensagemEnum.REAGENDAMENTO_CONCLUIDO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public marcarHorarioAtendimento(diaria: InfoAgendamentoDTO, entrada: boolean) {
    let registro = new RegistroAgendamentoDTO();
    registro.horario = DateUtils.newDate();
    registro.idCliente = diaria.idCliente;
    registro.dataDiaria = diaria.dataDiaria;
    registro.idDiaria = diaria.idDiaria;

    this._agendService.registrarHorarioAtendimento(registro)
      .subscribe((result: any) => {
        this._changes.detectChanges();
        this._notificacaoService.alerta(entrada ? "Entrada Registrada!" : "Saída Registrada!");
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao consultar os agendamentos. Tente novamente mais tarde!");
      });
  }

}
