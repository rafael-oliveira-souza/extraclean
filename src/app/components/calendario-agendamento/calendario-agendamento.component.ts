import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  public mapMat: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public mapVesp: Map<string, Array<InfoAgendamentoDTO | null>> = new Map();
  public proximosPeriodos: Date[] = [];
  public ultimosPeriodos: Date[] = [];
  public proximoPeriodoSelecionado: Date[] = [];
  public periodo: number = 0;
  public qtdInfo: string = "1:1";
  public infos: InfoAgendamentoDTO[] = [];
  public profissionais: Set<string> = new Set<string>();
  public profissional!: string;
  public turno: number = TurnoEnum.NAO_DEFINIDO;
  public periodoUnico: Date = new Date();
  public dataReagendamento: Date = new Date();

  constructor(private _agendService: AgendamentoService, private _changes: ChangeDetectorRef) { }

  ngOnInit() {
    this.getProximosPeriodos();
    this.atualizarPeriodo();
  }

  public atualizarPeriodo() {
    this.proximoPeriodoSelecionado = [];
    this.ultimosPeriodos = DateUtils.getNextDays(new Date(), 7);
    this.periodoUnico = this.ultimosPeriodos[this.periodo];
    const dataAtual: Date = this.proximosPeriodos[this.periodo];
    const ultimaSegunda: moment.Moment = DateUtils.toMoment(dataAtual).day(1);
    this.proximoPeriodoSelecionado.push(ultimaSegunda.toDate());
    for (let i = 0; i < 5; i++) {
      ultimaSegunda.add(1, 'day');
      this.proximoPeriodoSelecionado.push(ultimaSegunda.toDate());
    }

    this.mapMat = new Map();
    this.mapVesp = new Map();
    this.proximoPeriodoSelecionado.forEach(per => {
      const dataDiaria = this.formatarData(per);
      this.mapVesp.set(dataDiaria, [null]);
      this.mapMat.set(dataDiaria, [null]);
    });

    this._agendService
      .recuperarInfoAgendamentos(this.formatarData(dataAtual))
      .subscribe((infos: InfoAgendamentoDTO[]) => {
        this.infos = infos;
        this.atualizarCalendario(infos);
      });
  }

  private atualizarCalendario(infos: InfoAgendamentoDTO[]) {
    infos.forEach(info => {
      this.profissionais.add(info.nomeDiarista);
      if (info.turno = TurnoEnum.MATUTINO) {
        this.atualizarMap(info, this.mapMat);
      }
      else if (info.turno = TurnoEnum.VESPERTINO) {
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
    const infos = this.infos.filter(info => !this.profissional || info.nomeDiarista.trim().toLowerCase() == this.profissional.trim().toLowerCase());
    this.atualizarCalendario(infos);
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

    const ultimaSegunda: moment.Moment = DateUtils.toMoment(new Date()).day(1);
    this.proximosPeriodos.push(ultimaSegunda.toDate());
    for (let i = 0; i < 4; i++) {
      ultimaSegunda.add(7, 'day');
      this.proximosPeriodos.push(ultimaSegunda.toDate());
    }
  }

  public getLabel(data: Date) {
    if (!data) {
      return "";
    }

    return DateUtils.format(data, 'DD/MM/YYYY') + " - " + DateUtils.format(DateUtils.toMoment(data).add(5, 'day'), 'DD/MM/YYYY');
  }

  public isXs() {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public getDiasSemana(date: MomentInput) {
    return DateUtils.getDiasSemana(date);
  }

  public isPagamentoEmAberto(diaria: InfoAgendamentoDTO) {
    return diaria.situacaoPagamento == 1 || diaria.situacaoPagamento == 0 || diaria.situacaoPagamento == 2;
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
      });
  }

  public cancelarAgendamento(diaria: InfoAgendamentoDTO) {
    let agend = new FinalizacaoAgendamentoDTO();
    agend.dataDiaria = diaria.dataDiaria;
    agend.idCliente = diaria.idCliente;
    agend.codigoPagamento = diaria.codigoPagamento;

    this._agendService
      .cancelarAgendamento(agend)
      .subscribe((info: any) => {
        diaria.situacao = SituacaoDiariaEnum.FINALIZADA;
        diaria.situacaoPagamento = SituacaoPagamentoEnum.APROVADO;
        this._changes.detectChanges();
      });
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
        this._changes.detectChanges();
      });
  }


}
