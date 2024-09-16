import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PipeModule } from '../../pipes/pipe.module';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-profissional',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    PipeModule,
    MatSelectModule,
  ],
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.scss']
})
export class ProfissionalComponent implements OnInit {

  @Input('profissionais')
  public profissionais: Array<ProfissionalDTO> = [];

  @Output()
  public atualizarProfissional: EventEmitter<ProfissionalDTO> = new EventEmitter();

  @Output()
  public profissionalSelecionadoChange: EventEmitter<number> = new EventEmitter();

  @Output()
  public profissionaisSelecionadosChange: EventEmitter<number[]> = new EventEmitter();

  @Input('profissionalSelecionado')
  public profissionalSelecionado: number = 0;

  @Input('profissionaisSelecionados')
  public profissionaisSelecionados: number[] = [0];

  @Input('multiplo')
  public multiplo: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public recuperarProfissional() {
    this.profissionalSelecionadoChange.emit(this.profissionalSelecionado);
    this.profissionaisSelecionadosChange.emit(this.profissionaisSelecionados);
    if (this.profissionais) {
      this.profissionais.forEach(prof => {
        if (prof.id == this.profissionalSelecionado || this.profissionaisSelecionados.includes(prof.id)) {
          this.atualizarProfissional.emit(prof);
        }
      });
    } else {
      this.atualizarProfissional.emit(ProfissionalDTO.empty());
    }
  }

}
