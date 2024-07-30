import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, model, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DateUtils } from '../../utils/DateUtils';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Moment, MomentInput } from 'moment';
import { PipeModule } from '../../pipes/pipe.module';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DiaSemanaEnum } from '../../domains/enums/DiaSemanaEnum';


@Component({
  selector: 'app-calendario',
  standalone: true,
  providers: [
  ],
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

  @Output()
  public getDiasAgendados: EventEmitter<Array<MomentInput>> = new EventEmitter();

  public hoje: MomentInput = DateUtils.newDate();
  public diaSelecionado = new FormControl(DateUtils.toMoment(this.hoje));
  public maxDate: MomentInput = DateUtils.add(this.hoje, 1, 'year');
  public diasCalendario: Array<MomentInput> = this.getDiasMes();
  public diasAgendados: Map<string, MomentInput> = new Map<string, Date>();
  public diasSemana: Array<string> = this.getDiasSemana();

  constructor(private _changes: ChangeDetectorRef) { }

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
    const isSelected = inputData.getAttribute("selected");
    if (isSelected == "true") {
      inputData.setAttribute("selected", "false");
      this.removerAgendamento(dia);
    } else {
      inputData.setAttribute("selected", "true");
      this.adicionarAgendamento(dia);
    }
    
    const values = Array.from(this.diasAgendados.values());
    this.getDiasAgendados.emit(values);
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

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.diaSelecionado.value ?? DateUtils.toMoment(this.hoje);
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.diaSelecionado.setValue(ctrlValue);
    datepicker.close();
    this.atualizarAgendamento();
  }
}
