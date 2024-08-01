import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { MoedaPipe } from './moeda.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MoedaPipe,
    DatePipe
  ],
  exports: [
    DatePipe,
    MoedaPipe,
  ]
})
export class PipeModule { }
