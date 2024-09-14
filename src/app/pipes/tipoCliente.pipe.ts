import { Pipe, PipeTransform } from '@angular/core';
import { TipoClienteEnum } from '../domains/enums/TipoClienteEnum';

@Pipe({
  name: 'tipoCliente',
  standalone: true
})
export class TipoClientePipe implements PipeTransform {

  transform(value: string | number | TipoClienteEnum): string {
    switch (value) {
      case 1:
        return "Cliente";
      case "1":
        return "Cliente";
      case TipoClienteEnum.CLIENTE:
        return "Cliente";
      case 2:
        return "Diarista";
      case "2":
        return "Diarista";
      case TipoClienteEnum.DIARISTA:
        return "Diarista";
      default:
        return "Administrador";
    }
  }

}
