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


@Component({
  selector: 'app-calendario',
  standalone: true,
  providers: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    CommonModule,
    PipeModule,
    MatIconModule,
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
  public metragem: number | null = 0;

  @Input('valorMetro')
  public valorMetro: number = 2;

  @Input('profissionais')
  public profissionais: Array<ProfissionalDTO> = [];

  @Input('isDetalhada')
  public isDetalhada: boolean = false;

  @Output()
  public getDiasAgendados: EventEmitter<Array<MomentInput>> = new EventEmitter();

  public readonly PROFISSIONAL_SELECIONADO = 20;
  public readonly VALOR_DIARIA_DETALHADA = 1.9;
  public hoje: MomentInput = DateUtils.newDate();
  public diaSelecionado = new FormControl(DateUtils.toMoment(this.hoje));
  public maxDate: MomentInput = DateUtils.add(this.hoje, 1, 'year');
  public diasCalendario: Array<MomentInput> = this.getDiasMes();
  public diasAgendados: Map<string, MomentInput> = new Map<string, Date>();
  public diasSemana: Array<string> = this.getDiasSemana();
  public profissional: ProfissionalDTO = ProfissionalDTO.empty();
  public profissionalSelecionado: number = 0;
  public turno: string = "";
  public valorTotal: number = 0;
  public desconto: number = 0;
  public readonly MAX_PERCENTUAL: number = 15;

  constructor(private _changes: ChangeDetectorRef) {
    this.calcular();
  }

  adicionarAgendamento(diaSelecionado: MomentInput): void {
    const diaFormatado = DateUtils.format(diaSelecionado, "yyyy_MM_DD");
    this.diasAgendados.set(diaFormatado, diaSelecionado);
  }

  removerAgendamento(diaSelecionado: MomentInput): void {
    const diaFormatado = DateUtils.format(diaSelecionado, "yyyy_MM_DD");
    this.diasAgendados.delete(diaFormatado);
  }

  atualizarAgendamento(): void {
    this.diasCalendario = this.getDiasMes();
    this.diasSemana = this.getDiasSemana();
    this.diasAgendados.clear();
    this._changes.detectChanges();
  }

  selecionarData(inputData: HTMLElement, dia: MomentInput) {
    const isDisabled = inputData.getAttribute("disabled");
    if (isDisabled == "false") {
      const isSelected = inputData.getAttribute("selected");
      if (isSelected == "true") {
        inputData.setAttribute("selected", "false");
        this.removerAgendamento(dia);
      } else {
        inputData.setAttribute("selected", "true");
        this.adicionarAgendamento(dia);
      }

      this.calcular();
      const values = Array.from(this.diasAgendados.values());
      this.getDiasAgendados.emit(values);
    }
  }


  habilitarData(inputData: HTMLElement, dia: MomentInput) {
    if (dia) {
      inputData.setAttribute("disabled", "false");
    } else {
      inputData.setAttribute("disabled", "true");
      inputData.setAttribute("selected", "false");
    }

    return dia;
  }

  getDiasMes() {
    return DateUtils.datesInMonth(this.diaSelecionado.value);
    // .map(dia => dia.getDate());
  }

  getDiasSemana() {
    this.adicionarDataVazia();
    return Object.values(DiaSemanaEnum);
    // return diasCalendario.slice(0, 7).map(dia => new TitleCasePipe().transform(DateUtils.toMoment(dia).format('dddd')));
  }

  adicionarDataVazia() {
    let primeiroDia: number = DateUtils.toDate(this.diasCalendario[0]).day();
    let ultimoDia: number = DateUtils.toDate(this.diasCalendario[this.diasCalendario.length - 1]).day();
    while (primeiroDia > 0) {
      this.diasCalendario.unshift(null);
      primeiroDia--;
    }

    while (6 > ultimoDia) {
      this.diasCalendario.push(null);
      ultimoDia++;
    }
  }

  anterior() {
    if (DateUtils.isAfter(this.diaSelecionado.value, this.hoje)) {
      const newDate = DateUtils.subtract(this.diaSelecionado.value, 1, 'month');
      this.diaSelecionado.setValue(newDate);
      this.atualizarAgendamento();
    }
  }

  proximo() {
    if (DateUtils.isBefore(this.diaSelecionado.value, this.maxDate)) {
      const newDate = DateUtils.add(this.diaSelecionado.value, 1, 'month');
      this.diaSelecionado.setValue(newDate);
      this.atualizarAgendamento();
    }
  }

  getQtdDias() {
    return Array.from(this.diasAgendados.values()).length;
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.diaSelecionado.value ?? DateUtils.toMoment(this.hoje);
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.diaSelecionado.setValue(ctrlValue);
    datepicker.close();
    this.atualizarAgendamento();
  }

  calcular() {
    this.valorTotal = 0;
    this.desconto = 0;

    const qtdDias = this.getQtdDias();
    if (qtdDias && this.valorMetro && this.metragem) {
      this.valorTotal += qtdDias * NumberUtils.arredondarCasasDecimais(this.valorMetro, 2) * this.metragem;
    }

    if (this.profissionalSelecionado != 0) {
      this.valorTotal += this.PROFISSIONAL_SELECIONADO * qtdDias;
    }

    if (this.isDetalhada) {
      this.valorTotal *= this.VALOR_DIARIA_DETALHADA;
    }

    if (qtdDias > 1) {
      let porcentagem = qtdDias * 2;
      this.valorTotal = this.aplicarDesconto(this.valorTotal, porcentagem);
    }

    return this.valorTotal;
  }

  public atualizarProfissional() {
    this.profissional = ProfissionalDTO.empty();
    this.profissionais.forEach(prof => {
      if (this.profissionalSelecionado == prof.id) {
        this.profissional = prof;
      }
    })
    this.calcular();
  }

  private aplicarDesconto(valor: number, percentual: number) {
    this.desconto = 0;
    if (valor > 0 && percentual > 0) {
      this.desconto = this.calcularDesconto(valor, percentual);
    }

    return valor - this.desconto
  }

  private calcularDesconto(valor: number, percentual: number): number {
    let desconto = 0;
    if (percentual > this.MAX_PERCENTUAL) {
      percentual = this.MAX_PERCENTUAL;
    }

    if (valor > 0 && percentual > 0) {
      desconto = valor * percentual / 100;
    }

    return desconto;
  }
}
