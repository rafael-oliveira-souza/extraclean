import { Pipe, PipeTransform } from '@angular/core';
import { TipoServicoEnum } from '../domains/enums/TipoServicoEnum';

@Pipe({
  name: 'tipoServico',
  standalone: true
})
export class TipoServicoPipe implements PipeTransform {

  transform(value: string | number | TipoServicoEnum): string {
    switch (value) {
      case 1:
        return "Expressa";
      case "1":
        return "Expressa";
      case TipoServicoEnum.EXPRESSA:
        return "Expressa";
      case 2:
        return "Detalhada";
      case "2":
        return "Detalhada";
      case TipoServicoEnum.DETALHADA:
        return "Detalhada";
      case 3:
        return "Pré Mudança";
      case "3":
        return "Pré Mudança";
      case TipoServicoEnum.PRE_MUDANCA:
        return "Pré Mudança";
      case 4:
        return "Residencial";
      case "4":
        return "Residencial";
      case TipoServicoEnum.PRE_MUDANCA:
        return "Residencial";
      case 5:
        return "Empresarial";
      case "5":
        return "Empresarial";
      case TipoServicoEnum.EMPRESARIAL:
        return "Empresarial";
      case 6:
        return "Passadoria";
      case "6":
        return "Passadoria";
      case TipoServicoEnum.PASSADORIA:
        return "Passadoria";
      default:
        return "Não Definido";
    }
  }

}
