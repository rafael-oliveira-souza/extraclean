import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AgendamentoComponent } from "../agendamento/agendamento.component";
import { PlanosComponent } from '../planos/planos.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, AgendamentoComponent, PlanosComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
