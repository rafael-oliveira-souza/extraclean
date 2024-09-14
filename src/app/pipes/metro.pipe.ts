import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metro',
  standalone: true
})
export class MetroPipe implements PipeTransform {

  transform(value: string | number): unknown {
    if (!value) {
      return "";
    }

    return value + "m²";
  }
}
