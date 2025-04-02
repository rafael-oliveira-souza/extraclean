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
        return "Limpeza Expressa";
      case "1":
        return "Limpeza Expressa";
      case TipoServicoEnum.EXPRESSA:
        return "Limpeza Expressa";
      case 2:
        return "Limpeza Detalhada";
      case "2":
        return "Limpeza Detalhada";
      case TipoServicoEnum.DETALHADA:
        return "Limpeza Detalhada";
      case 3:
        return "Limpeza Pré Mudança";
      case "3":
        return "Limpeza Pré Mudança";
      case TipoServicoEnum.PRE_MUDANCA:
        return "Limpeza Pré Mudança";
      case 4:
        return "Limpeza Residencial";
      case "4":
        return "Limpeza Residencial";
      case TipoServicoEnum.PRE_MUDANCA:
        return "Limpeza Residencial";
      case 5:
        return "Limpeza Empresarial";
      case "5":
        return "Limpeza Empresarial";
      case TipoServicoEnum.EMPRESARIAL:
        return "Limpeza Empresarial";
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
