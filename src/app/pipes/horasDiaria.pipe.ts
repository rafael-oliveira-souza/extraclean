import { Pipe, PipeTransform } from '@angular/core';
import { HorasEnum } from '../domains/enums/HorasEnum';
import { AgendamentoConstantes } from '../domains/constantes/AgendamentoConstantes';

@Pipe({
  name: 'horasDiaria',
  standalone: true
})
export class HorasDiariaPipe implements PipeTransform {

  transform(value: string | number | HorasEnum): string {
    const horaInfo = AgendamentoConstantes.getInfoHora(value);
    if (horaInfo.id == HorasEnum.NAO_DEFINIDO) {
      return "Não Definido";
    } else {
      return horaInfo.descricao;
    }
  }

}
