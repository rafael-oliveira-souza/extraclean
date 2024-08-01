import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../pipes/pipe.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    PipeModule,
    MatCheckboxModule
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent {

  public planos: Array<PlanoDTO> = [];
  public planoPlus: boolean = false;

  constructor(){
    this.planos.push(new PlanoDTO("Diário", "Plano Meu lar", 99))
    this.planos.push(new PlanoDTO("Semanal", "", 99))
    this.planos.push(new PlanoDTO("Mensal", "", 99))
    this.planos.push(new PlanoDTO("Anual", "", 99))
  }
}
