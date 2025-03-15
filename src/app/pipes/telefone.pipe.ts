import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
  standalone: true
})
export class TelefonePipe implements PipeTransform {

  transform(phone: string): unknown {
    const cleanedPhone = phone.replace(/\D/g, "");

    // Verifica se o número tem o comprimento correto
    if (cleanedPhone.length === 11) {
      // Formato (XX) XXXXX-XXXX
      return `(${cleanedPhone.substring(0, 2)}) ${cleanedPhone.substring(2, 7)}-${cleanedPhone.substring(7)}`;
    } else if (cleanedPhone.length === 10) {
      // Formato (XX) XXXX-XXXX
      return `(${cleanedPhone.substring(0, 2)}) ${cleanedPhone.substring(2, 6)}-${cleanedPhone.substring(6)}`;
    } else {
      // Se o número não tem 10 ou 11 dígitos, retorna null
      return null;
    }
  }

}
