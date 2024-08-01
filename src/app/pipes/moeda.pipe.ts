import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { MomentInput } from 'moment';
import { LinguagemEnum } from '../domains/enums/LinguagemEnum';

@Pipe({
  name: 'moeda',
  standalone: true
})
export class MoedaPipe implements PipeTransform {

  transform(value: string | number, format?: string): unknown {
    if (!value) {
      return null;
    }

    const currencyPipe = new CurrencyPipe("pt-BR");
    if (format) {
      return currencyPipe.transform(value, format);
    }

    return currencyPipe.transform(value, "BRL");
  }

}
