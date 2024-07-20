import { ChangeDetectionStrategy, Component, Input, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateUtils } from '../../utils/DateUtils';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MomentInput } from 'moment';

@Component({
  selector: 'app-calendario',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
  ],
  imports: [FormsModule, MatCardModule, MatDatepickerModule, MatInputModule, MatFormFieldModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {
  @Input('disponibilidade')
  public disponibilidade: Array<Date> = [];

  @Input('largura')
  public largura: string = "100%";
  public minDate: MomentInput = DateUtils.newDate();
  public maxDate: MomentInput = DateUtils.add(this.minDate, 1, 'year');

  agendamento: MomentInput = DateUtils.newDate();

  atualizarAgendamento(agendamento: any): void {
    this.agendamento =  DateUtils.toMoment(agendamento);
  }
}
