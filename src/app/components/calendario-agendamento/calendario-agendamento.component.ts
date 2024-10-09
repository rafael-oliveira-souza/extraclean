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
    FormsModule,
    CommonModule,
    PipeModule,
    ScrollComponent
  ],
  templateUrl: './calendario-agendamento.component.html',
  styleUrls: ['./calendario-agendamento.component.scss']
})
export class CalendarioAgendamentoComponent implements OnInit {

  @Input('isAdm')
  public isAdm: boolean = false;

  @Input('profissional')
  public profissional: string = "";

  public mapMat: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public mapVesp: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public map: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public proximosPeriodos: Date[] = [];
  public ultimosPeriodos: Date[] = [];
  public proximoPeriodoSelecionado: Date[] = [];
  public periodo: number = 0;
  public qtdInfo: string = "1:1";
  public infos: InfoAgendamentoDTO[] = [];
  public profissionais: Set<string> = new Set<string>();
  public turno: number = TurnoEnum.NAO_DEFINIDO;
  public periodoUnico: Date = new Date();
  public hoje: Date = new Date();

  constructor(private _agendService: AgendamentoService,
    private _notificacaoService: NotificacaoService,
    private _changes: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getProximosPeriodos();
    this.atualizarPeriodo();
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

    this._agendService
      .recuperarInfoAgendamentos(this.formatarData(dataAtual), null, null)
      .subscribe((infos: InfoAgendamentoDTO[]) => {
        this.infos = infos;
        if (this.profissional) {
          this.infos = this.filtrarProfissional();
        }

        this.atualizarCalendario(this.infos);
      });
  }

  private atualizarCalendario(infos: InfoAgendamentoDTO[]) {
    infos.forEach(info => {
      this.profissionais.add(info.nomeDiarista);
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
      DateUtils.getNextDays(new Date(), 7).forEach(data => {
        this.proximosPeriodos.push(data);
      });
    } else {
      const ultimaSegunda: moment.Moment = DateUtils.toMoment(new Date()).day(1);
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
    return !this.isDiariaFinalizada(diaria) && !this.isPagamentoAprovado(diaria);
  }

  public isDiariaFinalizada(diaria: InfoAgendamentoDTO) {
    return diaria.situacao == SituacaoDiariaEnum.FINALIZADA;
  }

  public isPagamentoAprovado(diaria: InfoAgendamentoDTO) {
    return diaria.situacaoPagamento == SituacaoPagamentoEnum.APROVADO;
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

    this._agendService
      .atualizarProfissionalAgendamento(agend)
      .subscribe((info: any) => {
        this._notificacaoService.alerta(MensagemEnum.PROFISSIONAL_ATUALIZADO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public finalizarAgendamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;

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
    registro.horario = new Date();
    registro.idCliente = diaria.idCliente;
    registro.dataDiaria = diaria.dataDiaria;

    this._agendService.registrarHorarioAtendimento(registro)
      .subscribe((result: any) => {
        this._changes.detectChanges();
        this._notificacaoService.alerta(entrada ? "Entrada Registrada!" : "Saída Registrada!");
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao consultar os agendamentos. Tente novamente mais tarde!");
      });
  }

}
