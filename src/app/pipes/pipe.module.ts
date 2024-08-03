import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { MoedaPipe } from './moeda.pipe';
import { CepPipe } from './cep.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MoedaPipe,
    CepPipe,
    DatePipe
  ],
  exports: [
    DatePipe,
    MoedaPipe,
    CepPipe,
  ]
})
export class PipeModule { }
