import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { MoedaPipe } from './moeda.pipe';
import { CepPipe } from './cep.pipe';
import { TurnoPipe } from './turno.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MoedaPipe,
    CepPipe,
    DatePipe,
    TurnoPipe
  ],
  exports: [
    DatePipe,
    MoedaPipe,
    CepPipe,
    TurnoPipe
  ]
})
export class PipeModule { }
