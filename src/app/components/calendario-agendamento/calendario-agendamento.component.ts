import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { DateUtils } from '../../utils/DateUtils';
import moment from 'moment';
import { PipeModule } from '../../pipes/pipe.module';
import { AgendamentoService } from '../../services/agendamento.service';
import { InfoAgendamentoDTO } from '../../domains/dtos/InfoAgendamentoDTO';
import { TurnoEnum } from '../../domains/enums/TurnoEnum';

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
    PipeModule
  ],
  templateUrl: './calendario-agendamento.component.html',
  styleUrls: ['./calendario-agendamento.component.scss']
})
export class CalendarioAgendamentoComponent implements OnInit {
  public diariasMatutinas: InfoAgendamentoDTO[] = [];
  public diariasVespertinas: InfoAgendamentoDTO[] = [];
  public proximosPeriodos: Date[] = [];
  public proximoPeriodoSelecionado: Date[] = [];
  public periodo: number = 0;

  constructor(private _agendService: AgendamentoService) { }

  ngOnInit() {
    this.getProximosPeriodos();
    this.atualizarPeriodo();
  }

  public atualizarPeriodo() {
    this.proximoPeriodoSelecionado = [];
    const dataAtual: Date = this.proximosPeriodos[this.periodo];
    const ultimaSegunda: moment.Moment = DateUtils.toMoment(dataAtual).day(1);
    this.proximoPeriodoSelecionado.push(ultimaSegunda.toDate());
    for (let i = 0; i < 5; i++) {
      ultimaSegunda.add(1, 'day');
      this.proximoPeriodoSelecionado.push(ultimaSegunda.toDate());
    }

    this._agendService
      .recuperarInfoAgendamentos(DateUtils.format(dataAtual, 'YYYY-MM-DD'))
      .subscribe((infos: InfoAgendamentoDTO[]) => {
        infos.forEach(info => {
          if (info.turno = TurnoEnum.MATUTINO) {
            this.diariasMatutinas.push(info);
          }
          else if (info.turno = TurnoEnum.VESPERTINO) {
            this.diariasVespertinas.push(info);
          }
        });

        while (this.diariasMatutinas.length < 6) {
          this.diariasMatutinas.push(new InfoAgendamentoDTO());
        }

        while (this.diariasVespertinas.length < 6) {
          this.diariasVespertinas.push(new InfoAgendamentoDTO());
        }
      });
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

}
