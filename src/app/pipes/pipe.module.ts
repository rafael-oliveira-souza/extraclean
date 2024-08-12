import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { MoedaPipe } from './moeda.pipe';
import { CepPipe } from './cep.pipe';
import { TurnoPipe } from './turno.pipe';
import { MetragemPipe } from './metragem.pipe';
import { PontoPipe } from './ponto.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MoedaPipe,
    CepPipe,
    DatePipe,
    TurnoPipe,
    MetragemPipe,
    PontoPipe,
  ],
  exports: [
    DatePipe,
    MoedaPipe,
    CepPipe,
    TurnoPipe,
    MetragemPipe,
    PontoPipe,
  ]
})
export class PipeModule { }
