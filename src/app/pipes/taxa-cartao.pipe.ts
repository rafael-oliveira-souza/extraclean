import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxaCartao',
  standalone: true
})
export class TaxaCartaoPipe implements PipeTransform {

  transform(value: string | number): number {
    if (!value) {
      return 0;
    } else if (value == 1 || value == '1') {
      return 5;
    } else if (value == 2 || value == '2') {
      return 5.8;
    } else if (value == 3 || value == '3') {
      return 6.3;
    } else if (value == 4 || value == '4') {
      return 7;
    }

    return 0;
  }
}
