import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, model, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DateUtils } from '../../utils/DateUtils';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Moment, MomentInput } from 'moment';
import { PipeModule } from '../../pipes/pipe.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DiaSemanaEnum } from '../../domains/enums/DiaSemanaEnum';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { NumberUtils } from '../../utils/NumberUtils';
import { LegendaComponent } from '../legenda/legenda.component';
import { CorEnum } from '../../domains/enums/CorEnum';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { MatButtonModule } from '@angular/material/button';
import { AgendamentoDiariaDTO } from '../../domains/dtos/AgendamentoDiariaDTO';
import { TurnoEnum } from '../../domains/enums/TurnoEnum';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { ProfissionalService } from '../../services/profissional.service';
import { OrigemPagamentoEnum } from '../../domains/enums/OrigemPagamentoEnum';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { ProfissionalComponent } from '../profissional/profissional.component';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { DiariaService } from '../../services/diaria.service';
import { TipoServicoEnum } from '../../domains/enums/TipoServicoEnum';
import { AgendamentoPagamentoInfoDTO } from '../../domains/dtos/AgendamentoPagamentoInfoDTO';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LinguagemEnum } from '../../domains/enums/LinguagemEnum';
import { HorasEnum } from '../../domains/enums/HorasEnum';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-calendario',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: LinguagemEnum.PT },
    provideMomentDateAdapter(MY_FORMATS),
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatButtonModule,
    CommonModule,
    PipeModule,
    MatIconModule,
    LegendaComponent,
    ProfissionalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  @Input('disponibilidade')
  public disponibilidade: Array<Date> = [];

  @Input('largura')
  public largura: string = "100%";

  @Input('metragem')
  public metragem: number = 0;

  @Input('profissionais')
  public profissionais: Array<ProfissionalDTO> = [];

  @Input('tipoLimpeza')
  public tipoLimpeza: TipoServicoEnum = TipoServicoEnum.EXPRESSA;

  @Output()
  public getDiasAgendados: EventEmitter<Array<MomentInput>> = new EventEmitter();

  @Output()
  public getDadosAgendamento: EventEmitter<AgendamentoDTO> = new EventEmitter();
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public readonly ATTR_INDISPONIBLE: string = "indisponible";
  public readonly ATTR_SELECTED: string = "selected";
  public readonly ATTR_DISABLED: string = "disabled";
  public readonly VALORES_HORAS: { id: HorasEnum, valor: number, descricao: string, numProfissionais: number }[] = AgendamentoConstantes.VALORES_HORAS;

  public valor4Horas: HorasEnum = HorasEnum.HORAS_4;
  public qtdHoras: HorasEnum = this.valor4Horas;
  public hoje: MomentInput = DateUtils.newDate();
  public diaSelecionado = new FormControl(DateUtils.add(this.hoje, 1, 'day'));
  public maxDate: MomentInput = DateUtils.add(this.hoje, 1, 'year');
  public diasCalendario: Array<MomentInput> = this.getDiasMes();
  public diasAgendados: Map<string, MomentInput> = new Map<string, Date>();
  public diasSemana: Array<string> = this.getDiasSemana();
  public profissional: ProfissionalDTO | null = null;
  public profissionalSelecionado: number = 0;
  public diasAgendadosProfissional: AgendamentoDiariaDTO[] = [];
  public turno: TurnoEnum = TurnoEnum.MATUTINO;
  public valorTotal: number = 0;
  public desconto: number = 0;
  public corVerde: CorEnum = CorEnum.verde;
  public corCinza: CorEnum = CorEnum.cinza;
  public corIndisponivel: CorEnum = CorEnum.laranja;
  public corPrincipal: CorEnum = CorEnum.primary;

  constructor(private _changes: ChangeDetectorRef,
    private _diariaService: DiariaService) {
    this.calcular();
  }

  ngOnInit(): void {
    this.recuperarDiariasAgendadasMes(this.diaSelecionado.value);
  }

  public recuperarDiariasAgendadasMes(data: Moment | null) {
    this._diariaService.recuperarDiariasAgendadasMes(this.turno, this.qtdHoras, DateUtils.toDate(data))
      .subscribe((agendamentos: Array<AgendamentoDiariaDTO>) => {
        if (typeof document !== 'undefined') {
          this.diasAgendadosProfissional = agendamentos;
          this.atualizarDiasDisponiveis();
        }
      });
  }

  public adicionarAgendamento(diaSelecionado: MomentInput): void {
    const diaFormatado = this.getDiaFormatado(diaSelecionado);
    this.diasAgendados.set(diaFormatado, diaSelecionado);
  }

  public removerAgendamento(diaSelecionado: MomentInput): void {
    const diaFormatado = this.getDiaFormatado(diaSelecionado);
    this.diasAgendados.delete(diaFormatado);
  }

  public atualizarAgendamento(): void {
    this.diasCalendario = this.getDiasMes();
    this.diasSemana = this.getDiasSemana();
    // this.diasAgendados.clear();
    this._changes.detectChanges();
  }

  public atualizarDiasSelecionados(updateAll: boolean = false) {
    this.atualizarDias();
    this.atualizarDiasDisponiveis();
    this.emitirDadosAgendamento();
  }

  public atualizarDias() {
    const diasMes: Array<Date> = DateUtils.datesInMonth(this.diaSelecionado.value);
    diasMes.forEach(dia => {
      const diaFormatado = this.getDiaFormatado(dia);
      const diaAgendado = this.diasAgendados.get(diaFormatado);
      const idDia = this.gerarIdElementoCalendarioDiario(dia);
      let inputData: HTMLElement | null = document.getElementById(idDia);
      inputData?.removeAttribute(this.ATTR_INDISPONIBLE);
      if (diaAgendado) {
        inputData?.setAttribute(this.ATTR_SELECTED, "true");
      } else {
        inputData?.setAttribute(this.ATTR_SELECTED, "false");
      }
    });
  }

  public atualizarDiasDisponiveis() {
    let filtrado: AgendamentoDiariaDTO[] = this.diasAgendadosProfissional;
    filtrado = this.atualizarProfissional(filtrado);
    filtrado = this.atualizarTurno(filtrado);
  }

  private atualizarDiasIndisponiveisCalendario(diasIndisponiveis: AgendamentoDiariaDTO[]) {
    diasIndisponiveis.forEach(agend => {
      if (typeof document !== 'undefined') {
        const idDia = this.gerarIdElementoCalendarioDiario(agend.dataHora);
        let inputData: HTMLElement | null = document.getElementById(idDia);
        if (inputData) {
          inputData.setAttribute(this.ATTR_INDISPONIBLE, "true");
        }
      }
    });
  }

  public selecionarData(inputData: HTMLElement, dia: MomentInput) {
    if (!dia) {
      return;
    }

    const isDisabled = inputData.getAttribute(this.ATTR_DISABLED);
    const isIndisponible = inputData.getAttribute(this.ATTR_INDISPONIBLE);
    if (isDisabled == "false" && (!isIndisponible || isIndisponible == "false")) {
      const isSelected = inputData.getAttribute(this.ATTR_SELECTED);
      if (isSelected == "true") {
        inputData.setAttribute(this.ATTR_SELECTED, "false");
        this.removerAgendamento(dia);
      } else {
        inputData.setAttribute(this.ATTR_SELECTED, "true");
        this.adicionarAgendamento(dia);
      }

      this.calcular();
      const diasSelecionados = Array.from(this.diasAgendados.values());
      this.getDiasAgendados.emit(diasSelecionados);
    }
  }

  private emitirDadosAgendamento() {
    const diasSelecionados = Array.from(this.diasAgendados.values());
    const agendamento = new AgendamentoDTO();
    agendamento.desconto = NumberUtils.arredondarCasasDecimais(this.desconto, 2);
    agendamento.valor = NumberUtils.arredondarCasasDecimais(this.valorTotal, 2);
    agendamento.diasSelecionados = diasSelecionados;
    agendamento.metragem = this.metragem;
    agendamento.tipoLimpeza = this.tipoLimpeza;
    agendamento.profissionais = [this.profissionalSelecionado];
    agendamento.horas = AgendamentoConstantes.getInfoHora(this.qtdHoras).id;
    agendamento.turno = this.turno;
    agendamento.dataHora = DateUtils.newDate();
    agendamento.email = LocalStorageUtils.getAuth()?.username;
    agendamento.extraPlus = !ProfissionalDTO.isEmpty(this.profissionalSelecionado);
    agendamento.origem = OrigemPagamentoEnum.AGENDAMENTO;
    agendamento.ignoreQtdProfissionais = false;

    this.getDadosAgendamento.emit(agendamento);
  }

  public habilitarData(inputData: HTMLElement, dia: MomentInput) {
    if (dia) {
      if (DateUtils.isSameOrBefore(dia, DateUtils.newDate())) {
        inputData.setAttribute(this.ATTR_DISABLED, "true");
        inputData.setAttribute(this.ATTR_SELECTED, "false");
      } else {
        inputData.id = this.gerarIdElementoCalendarioDiario(dia);
        inputData.setAttribute(this.ATTR_DISABLED, "false");
      }
    } else {
      inputData.id = "idBlockedDay";
      inputData.setAttribute(this.ATTR_DISABLED, "true");
      inputData.setAttribute(this.ATTR_SELECTED, "false");
    }

    return dia;
  }

  public getDiasMes() {
    return DateUtils.datesInMonth(this.diaSelecionado.value);
    // .map(dia => dia.getDate());
  }

  public getDiasSemana() {
    this.adicionarDataVazia();
    return Object.values(DiaSemanaEnum);
    // return diasCalendario.slice(0, 7).map(dia => new TitleCasePipe().transform(DateUtils.toMoment(dia).format('dddd')));
  }

  public adicionarDataVazia() {
    let primeiroDia: number = DateUtils.toMoment(this.diasCalendario[0]).day();
    let ultimoDia: number = DateUtils.toMoment(this.diasCalendario[this.diasCalendario.length - 1]).day();
    while (primeiroDia > 0) {
      this.diasCalendario.unshift(null);
      primeiroDia--;
    }

    while (5 > ultimoDia) {
      this.diasCalendario.push(null);
      ultimoDia++;
    }
  }

  public anterior() {
    if (DateUtils.isAfter(this.diaSelecionado.value, this.hoje)) {
      const newDate = DateUtils.subtract(this.diaSelecionado.value, 1, 'month');
      this.diaSelecionado.setValue(newDate);
      this.atualizarAgendamento();
      this.atualizarDiasSelecionados(false);
      this.recuperarDiariasAgendadasMes(newDate);
    }
  }

  public proximo() {
    if (DateUtils.isBefore(this.diaSelecionado.value, this.maxDate)) {
      const newDate = DateUtils.add(this.diaSelecionado.value, 1, 'month');
      this.diaSelecionado.setValue(newDate);
      this.atualizarAgendamento();
      this.atualizarDiasSelecionados(false);
      this.recuperarDiariasAgendadasMes(newDate);
    }
  }

  public getQtdDias() {
    return Array.from(this.diasAgendados.values()).length;
  }

  public setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.diaSelecionado.value ?? DateUtils.toMoment(this.hoje);
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.diaSelecionado.setValue(ctrlValue);
    datepicker.close();
    this.atualizarAgendamento();
  }

  public calcular() {
    this.valorTotal = 0;
    this.desconto = 0;

    const qtdDias = this.getQtdDias();
    const porcentagemDesconto = AgendamentoConstantes.calcularPorcentagemDias(qtdDias);
    let agendamento: AgendamentoPagamentoInfoDTO = AgendamentoConstantes
      .calcularTotalPorHora(this.qtdHoras, qtdDias, false, porcentagemDesconto, this.turno);

    this.desconto = agendamento.desconto;
    this.valorTotal = agendamento.total;
    this.metragem = agendamento.metragem;

    this.emitirDadosAgendamento();
    return this.valorTotal;
  }

  private atualizarProfissional(filtrados: AgendamentoDiariaDTO[]): AgendamentoDiariaDTO[] {
    this.profissional = null;
    this.removerIndisponiveis();

    if (this.profissionalSelecionado != 0) {
      this.profissionais.forEach(prof => {
        if (this.profissionalSelecionado == prof.id) {
          this.profissional = prof;
          filtrados = this.diasAgendadosProfissional
            .filter(agend => agend.profissionais.includes(prof.id));
        }
      });
    }

    // this.limparDiasSelecionados();
    this.atualizarDiasIndisponiveisCalendario(filtrados);
    this.calcular();
    return filtrados;
  }

  private atualizarTurno(filtrados: AgendamentoDiariaDTO[]): AgendamentoDiariaDTO[] {
    this.removerIndisponiveis();
    const turnoFiltrado: AgendamentoDiariaDTO[] = filtrados
      .filter(agend => this.turno == TurnoEnum.NAO_DEFINIDO
        || agend.turno == TurnoEnum.INTEGRAL
        || agend.turno == this.turno);

    this.atualizarDiasIndisponiveisCalendario(turnoFiltrado);
    return turnoFiltrado;
  }

  private removerIndisponiveis() {
    const indisponibleAttrs = document.querySelectorAll("[" + this.ATTR_INDISPONIBLE + "]");
    indisponibleAttrs.forEach(element => {
      element.removeAttribute(this.ATTR_INDISPONIBLE);
    });
  }

  public gerarIdElementoCalendarioDiario(dia: MomentInput) {
    const dataHora = DateUtils.toDate(dia, DateUtils.ES_LOCALDATETIME);
    return "id" + DateUtils.format(dataHora, "YYYYMMDD");
  }

  public limparDiasSelecionados() {
    this.diasAgendados.clear();
    this.atualizarDias();
  }

  private getDiaFormatado(diaSelecionado: MomentInput) {
    return DateUtils.format(diaSelecionado, "yyyy_MM_DD");
  }

  public isXs() {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public isDetalhada(): boolean {
    return this.tipoLimpeza == TipoServicoEnum.DETALHADA;
  }
}
