import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'turno',
  standalone: true
})
export class TurnoPipe implements PipeTransform {

  transform(value: string | number): string {
    switch (value) {
      case 1:
        return "Matutino";
      case "1":
        return "Matutino";
      case 2:
        return "Vespertino";
      case "2":
        return "Vespertino";
      default:
        return "";
    }
  }

}
