import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DatePipe
  ],
  exports: [
    DatePipe
  ]
})
export class PipeModule { }
