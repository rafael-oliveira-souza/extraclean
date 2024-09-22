import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simNao',
  standalone: true
})
export class SimNaoPipe implements PipeTransform {

  transform(value: string | boolean): string {
    return value ? "Sim" : "Não";
  }

}
