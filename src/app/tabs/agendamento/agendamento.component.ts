import { Component } from '@angular/core';
import { CalendarioComponent } from '../../components/calendario/calendario.component';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CalendarioComponent],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent {

}
