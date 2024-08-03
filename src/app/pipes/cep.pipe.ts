import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep',
  standalone: true
})
export class CepPipe implements PipeTransform {

  transform(value: string): unknown {
    if (!value) {
      return '';
    }

    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // Format the cleaned value
    if (cleaned.length <= 5) {
      return cleaned;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
    } else {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
    }
  }

}
