import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ponto',
  standalone: true
})
export class PontoPipe implements PipeTransform {

  transform(value: string, args: number = 15): unknown {
    if (!value) {
      return "";
    }
    return value.substring(0, args) + (value.length > args ? " ..." : "");
  }

}
