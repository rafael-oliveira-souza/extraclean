import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metragem',
  standalone: true
})
export class MetragemPipe implements PipeTransform {

  transform(value: string | number | null): unknown {
    if (!value) {
      return "";
    }
    return `${value} m²`;
  }

}
