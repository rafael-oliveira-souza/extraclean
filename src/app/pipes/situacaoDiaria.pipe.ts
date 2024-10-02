import { Pipe, PipeTransform } from '@angular/core';
import { SituacaoDiariaEnum } from '../domains/enums/SituacaoDiariaEnum';

@Pipe({
  name: 'situacaoDiaria',
  standalone: true
})
export class SituacaoDiariaPipe implements PipeTransform {

  transform(value: string | number | SituacaoDiariaEnum): string {
    switch (value) {
      case 0:
        return "Não Agendada";
      case "0":
        return "Não Agendada";
      case SituacaoDiariaEnum.NAO_AGENDADA:
        return "Não Agendada";
      case 1:
        return "Agendada";
      case "1":
        return "Agendada";
      case SituacaoDiariaEnum.AGENDADA:
        return "Agendada";
      case 2:
        return "Finalizada";
      case "2":
        return "Finalizada";
      case SituacaoDiariaEnum.NAO_AGENDADA:
        return "Finalizada";
      case 3:
        return "Cancelada";
      case "3":
        return "Cancelada";
      case SituacaoDiariaEnum.CANCELADA:
        return "Cancelada";
        case 4:
          return "Reagendada";
        case "4":
          return "Reagendada";
        case SituacaoDiariaEnum.REAGENDADA:
          return "Reagendada";
      default:
        return "Não Definido";
    }
  }

}
