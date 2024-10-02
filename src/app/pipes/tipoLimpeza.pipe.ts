import { Pipe, PipeTransform } from '@angular/core';
import { TipoLimpezaEnum } from '../domains/enums/TipoLimpezaEnum';

@Pipe({
  name: 'tipoLimpeza',
  standalone: true
})
export class TipoLimpezaPipe implements PipeTransform {

  transform(value: string | number | TipoLimpezaEnum): string {
    switch (value) {
      case 1:
        return "Expressa";
      case "1":
        return "Expressa";
      case TipoLimpezaEnum.EXPRESSA:
        return "Expressa";
      case 2:
        return "Detalhada";
      case "2":
        return "Detalhada";
      case TipoLimpezaEnum.DETALHADA:
        return "Detalhada";
        case 3:
          return "Pré Mudança";
        case "3":
          return "Pré Mudança";
        case TipoLimpezaEnum.PRE_MUDANCA:
          return "Pré Mudança";
      default:
        return "Não Definido";
    }
  }

}
