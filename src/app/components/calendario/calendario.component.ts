import { ChangeDetectionStrategy, Component, Input, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
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
import { LinguagemEnum } from '../../domains/enums/LinguagemEnum';

@Component({
  selector: 'app-calendario',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: LinguagemEnum.PT },
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

  public hoje: MomentInput = DateUtils.newDate();
  public maxDate: MomentInput = DateUtils.add(this.hoje, 1, 'year');
  public diasCalendario: Array<Date> = DateUtils.datesInMonth(this.hoje);
  public agendamento = DateUtils.toDate(this.hoje);
  public diasSemana: Array<string> = this.getDiasSemana(this.diasCalendario);

  atualizarAgendamento(agendamento: any): void {
    this.diasCalendario = DateUtils.datesInMonth(this.agendamento);
    this.diasSemana = this.getDiasSemana(this.diasCalendario);
  }

  getDiasSemana(diasCalendario: Array<Date>) {
    return diasCalendario.slice(0, 7).map(dia => new TitleCasePipe().transform(DateUtils.toMoment(dia).format('dddd')));
  }

  anterior() {
    this.agendamento = DateUtils.subtract(this.agendamento, 1, 'month');
    this.atualizarAgendamento(this.agendamento);
  }

  proximo() {
    this.agendamento = DateUtils.add(this.agendamento, 1, 'month');
    this.atualizarAgendamento(this.agendamento);
  }

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.agendamento.value ?? DateUtils.toMoment(this.hoje);
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.agendamento.setValue(ctrlValue);
  //   datepicker.close();
  // }
}
