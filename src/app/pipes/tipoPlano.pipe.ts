import { Pipe, PipeTransform } from '@angular/core';
import { TipoPlanoEnum } from '../domains/enums/TipoPlanoEnum';

@Pipe({
  name: 'tipoPlano',
  standalone: true
})
export class TipoPlanoPipe implements PipeTransform {

  transform(value: string | number | TipoPlanoEnum): string {
    switch (value) {
      case 1:
        return "2 Diárias";
      case "1":
        return "2 Diárias";
      case "DIARIA_2":
        return "2 Diárias";
      case TipoPlanoEnum.DIARIA_2:
        return "2 Diárias";
      case 2:
        return "4 Diárias";
      case "2":
        return "4 Diárias";
      case "DIARIA_4":
        return "4 Diárias";
      case TipoPlanoEnum.DIARIA_4:
        return "4 Diárias";
      case 3:
        return "6 Diárias";
      case "3":
        return "6 Diárias";
      case "DIARIA_6":
        return "6 Diárias";
      case TipoPlanoEnum.DIARIA_6:
        return "6 Diárias";
      case 4:
        return "8 Diárias";
      case "4":
        return "8 Diárias";
      case "DIARIA_8":
        return "8 Diárias";
      case TipoPlanoEnum.DIARIA_8:
        return "8 Diárias";
      case 5:
        return "10 Diárias";
      case "5":
        return "10 Diárias";
      case "DIARIA_10":
        return "10 Diárias";
      case TipoPlanoEnum.DIARIA_10:
        return "10 Diárias";
      default:
        return "Não Definido";
    }
  }

}
