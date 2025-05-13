import { Pipe, PipeTransform } from '@angular/core';
import { TipoDespesaEnum } from '../domains/enums/TipoDespesaEnum';

@Pipe({
  name: 'tipoDespesa',
  standalone: true
})
export class TipoDespesaPipe implements PipeTransform {

  transform(value: string | number | TipoDespesaEnum): string {
    switch (value) {
      case 0:
        return "Operacional";
      case "0":
        return "Operacional";
      case TipoDespesaEnum.OPERACIONAL:
        return "Operacional";
      case 1:
        return "Imposto";
      case "1":
        return "Imposto";
      case TipoDespesaEnum.IMPOSTO:
        return "Imposto";
      case 2:
        return "Extras";
      case "2":
        return "Extras";
      case TipoDespesaEnum.EXTRAS:
        return "Extras";
      default:
        return "Não Definido";
    }
  }

}
