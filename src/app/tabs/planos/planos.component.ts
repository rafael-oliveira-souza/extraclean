import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent {

  public planos: Array<PlanoDTO> = [];

  constructor(){
    this.planos.push(new PlanoDTO("Basico", 99))
    this.planos.push(new PlanoDTO("Basico2", 99))
    this.planos.push(new PlanoDTO("Basico3", 99))
    this.planos.push(new PlanoDTO("Basico4", 99))
  }
}
