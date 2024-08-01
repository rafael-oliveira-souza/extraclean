import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AgendamentoComponent } from "../agendamento/agendamento.component";
import { PlanosComponent } from '../planos/planos.component';
import { ServicosComponent } from '../servicos/servicos.component';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    AgendamentoComponent,
    PlanosComponent,
    ServicosComponent,
    MatButtonModule, 
    MatMenuModule,
    HomeComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
