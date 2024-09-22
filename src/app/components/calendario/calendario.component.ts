import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, model, Output, ViewEncapsulation } from '@angular/core';
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
import { AgendamentoInfoDTO } from '../../domains/dtos/AgendamentoInfoDTO';

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
export class CalendarioComponent {
  @Input('disponibilidade')
  public disponibilidade: Array<Date> = [];

  @Input('largura')
  public largura: string = "100%";

  @Input('metragem')
  public metragem: number = 0;

  @Input('valorMetro')
  public valorMetro: number = 2;

  @Input('profissionais')
  public profissionais: Array<ProfissionalDTO> = [];

  @Input('isDetalhada')
  public isDetalhada: boolean = false;

  @Output()
  public getDiasAgendados: EventEmitter<Array<MomentInput>> = new EventEmitter();

  @Output()
  public getDadosAgendamento: EventEmitter<AgendamentoDTO> = new EventEmitter();
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public readonly ATTR_INDISPONIBLE: string = "indisponible";
  public readonly ATTR_SELECTED: string = "selected";
  public readonly ATTR_DISABLED: string = "disabled";


  public hoje: MomentInput = DateUtils.newDate();
  public diaSelecionado = new FormControl(DateUtils.toMoment(this.hoje));
  public maxDate: MomentInput = DateUtils.add(this.hoje, 1, 'year');
  public diasCalendario: Array<MomentInput> = this.getDiasMes();
  public diasAgendados: Map<string, MomentInput> = new Map<string, Date>();
  public diasSemana: Array<string> = this.getDiasSemana();
  public profissional: ProfissionalDTO | null = null;
  public profissionalSelecionado: number = 0;
  public diasAgendadosProfissional: AgendamentoDiariaDTO[] = [];
  public turno: number = 0;
  public valorTotal: number = 0;
  public desconto: number = 0;
  public corVerde: CorEnum = CorEnum.verde;
  public corCinza: CorEnum = CorEnum.cinza;
  public corIndisponivel: CorEnum = CorEnum.laranja;
  public corPrincipal: CorEnum = CorEnum.primary;

  constructor(private _changes: ChangeDetectorRef, private _diaristaService: ProfissionalService) {
    this.calcular();
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
    this.atualizarProfissional();
    this.emitirDadosAgendamento();
  }

  public atualizarDias() {
    const diasMes = DateUtils.datesInMonth(this.diaSelecionado.value);
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

  public atualizarDiasDisponiveisProfissional() {
    if (this.profissionalSelecionado != 0) {
      this.diasAgendadosProfissional.forEach(agend => {
        const idDia = this.gerarIdElementoCalendarioDiario(agend.dataHora);
        let inputData: HTMLElement | null = document.getElementById(idDia);
        if (inputData) {
          inputData.setAttribute(this.ATTR_INDISPONIBLE, "true");
        }
      });
    }
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
    agendamento.profissionais = [this.profissionalSelecionado];
    agendamento.turno = this.turno;
    agendamento.dataHora = new Date();
    agendamento.email = LocalStorageUtils.getAuth()?.username;
    agendamento.extraPlus = !ProfissionalDTO.isEmpty(this.profissionalSelecionado);
    agendamento.origem = OrigemPagamentoEnum.AGENDAMENTO;
    agendamento.ignoreQtdProfissionais = false;

    this.getDadosAgendamento.emit(agendamento);
  }

  public habilitarData(inputData: HTMLElement, dia: MomentInput) {

    if (dia) {
      if (DateUtils.isSameOrBefore(dia, new Date())) {
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

    while (6 > ultimoDia) {
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
    }
  }

  public proximo() {
    if (DateUtils.isBefore(this.diaSelecionado.value, this.maxDate)) {
      const newDate = DateUtils.add(this.diaSelecionado.value, 1, 'month');
      this.diaSelecionado.setValue(newDate);
      this.atualizarAgendamento();
      this.atualizarDiasSelecionados(false);
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
    let agendamento: AgendamentoInfoDTO = AgendamentoConstantes.calcularTotal(this.metragem, this.isDetalhada, qtdDias,
      porcentagemDesconto, this.profissionalSelecionado != 0, this.turno);

    this.desconto = agendamento.desconto;
    this.valorTotal = agendamento.total;

    this.emitirDadosAgendamento();
    return this.valorTotal;
  }

  public atualizarProfissional() {
    this.profissional = null;
    this.diasAgendadosProfissional = [];
    const indisponibleAttrs = document.querySelectorAll("[" + this.ATTR_INDISPONIBLE + "]");
    indisponibleAttrs.forEach(element => {
      element.removeAttribute(this.ATTR_INDISPONIBLE);
    });

    if (this.profissionalSelecionado != 0) {
      this.profissionais.forEach(prof => {
        if (this.profissionalSelecionado == prof.id) {
          this.profissional = prof;
          const data = DateUtils.toMoment(this.diaSelecionado.value).toDate();
          this._diaristaService.recuperarDiariasPorProfissional(prof.id, this.turno, data)
            .subscribe((agendamentos: Array<AgendamentoDiariaDTO>) => {
              this.diasAgendadosProfissional = agendamentos.map(agend =>
                new AgendamentoDiariaDTO(DateUtils.toDate(agend.dataHora, DateUtils.ES_LOCALDATETIME), agend.turno));
              this.atualizarDiasDisponiveisProfissional();
            })
        }
      });
    }
    // this.limparDiasSelecionados();
    this.calcular();
  }

  public gerarIdElementoCalendarioDiario(dia: MomentInput) {
    return "id" + DateUtils.format(dia, "YYYYMMDD");
  }

  public limparDiasSelecionados() {
    this.diasAgendados.clear();
    this.atualizarDias();
  }

  private getDiaFormatado(diaSelecionado: MomentInput) {
    return DateUtils.format(diaSelecionado, "yyyy_MM_DD");
  }

  public isXs() {
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      return CalculoUtils.isLessThan(documentWidth, 900);
    }

    return false;
  }
}
