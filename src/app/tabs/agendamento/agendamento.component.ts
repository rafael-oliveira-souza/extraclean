import { Component } from '@angular/core';
import { CalendarioComponent } from '../../components/calendario/calendario.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MomentInput } from 'moment';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CalendarioComponent, MatButtonModule, MatIconModule],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent {
  public diasAgendados: Array<MomentInput> = [];

  public agendar() {
    console.log(this.diasAgendados)
  }

  public getDiasAgendados(diasAgendados: Array<MomentInput>) {
    this.diasAgendados = diasAgendados;
  }

  public desabilitarAgendamento() {
    return this.diasAgendados.length <= 0;
  }
}
