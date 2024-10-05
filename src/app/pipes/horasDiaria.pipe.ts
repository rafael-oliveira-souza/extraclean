import { Pipe, PipeTransform } from '@angular/core';
import { HorasEnum } from '../domains/enums/HorasEnum';

@Pipe({
  name: 'horasDiaria',
  standalone: true
})
export class HorasDiariaPipe implements PipeTransform {

  transform(value: string | number | HorasEnum): string {
    switch (value) {
      case 1:
        return "4 Horas - 1 Profissionais";
      case "1":
        return "4 Horas - 1 Profissionais";
      case HorasEnum.HORAS_4:
        return "4 Horas - 1 Profissionais";
      case 2:
        return "8 Horas - 1 Profissionais";
      case "2":
        return "8 Horas - 1 Profissionais";
      case HorasEnum.HORAS_8:
        return "8 Horas - 1 Profissionais";
      case 3:
        return "8 Horas - 2 Profissionais";
      case "3":
        return "8 Horas - 2 Profissionais";
      case HorasEnum.HORAS_16:
        return "8 Horas - 2 Profissionais";
      case 4:
        return "8 Horas - 3 Profissionais";
      case "4":
        return "8 Horas - 3 Profissionais";
      case HorasEnum.HORAS_24:
        return "8 Horas - 3 Profissionais";
      default:
        return "Não Definido";
    }
  }

}
