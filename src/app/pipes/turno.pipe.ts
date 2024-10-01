import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TurnoEnum } from '../domains/enums/TurnoEnum';

@Pipe({
  name: 'turno',
  standalone: true
})
export class TurnoPipe implements PipeTransform {

  transform(value: string | number | TurnoEnum): string {
    switch (value) {
      case 0:
        return "Não Definido";
      case "0":
        return "Não Definido";
      case TurnoEnum.NAO_DEFINIDO:
      case 1:
        return "Manhã";
      case "1":
        return "Manhã";
      case TurnoEnum.MATUTINO:
        return "Manhã";
      case 2:
        return "Tarde";
      case "2":
        return "Tarde";
      case TurnoEnum.VESPERTINO:
        return "Tarde";
      case 3:
        return "Integral";
      case "3":
        return "Integral";
      case TurnoEnum.INTEGRAL:
        return "Integral";
      default:
        return "";
    }
  }

}
