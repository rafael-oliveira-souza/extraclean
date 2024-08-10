import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moeda',
  standalone: true
})
export class MoedaPipe implements PipeTransform {

  transform(value: string | number, format?: string): unknown {
    const currencyPipe = new CurrencyPipe("pt-BR");
    if (!value) {
      return currencyPipe.transform(0, "BRL");
    }

    if (format) {
      return currencyPipe.transform(value, format);
    }

    return currencyPipe.transform(value, "BRL");
  }

}
