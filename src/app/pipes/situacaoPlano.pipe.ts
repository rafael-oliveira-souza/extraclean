import { Pipe, PipeTransform } from '@angular/core';
import { SituacaoPlanoEnum } from '../domains/enums/SituacaoPlanoEnum';

@Pipe({
  name: 'situacaoPlano',
  standalone: true
})
export class SituacaoPlanoPipe implements PipeTransform {

  transform(value: string | number | SituacaoPlanoEnum): string {
    switch (value) {
      case 1:
        return "Em execução";
      case "1":
        return "Em execução";
      case SituacaoPlanoEnum.EM_EXECUCAO:
        return "Em execução";
      case 2:
        return "Finalizado";
      case "2":
        return "Finalizado";
      case SituacaoPlanoEnum.FINALIZADO:
        return "Finalizado";
      case 3:
        return "Cancelado";
      case "3":
        return "Cancelado";
      case SituacaoPlanoEnum.CANCELADO:
        return "Cancelado";
      default:
        return "Não Definido";
    }
  }

}
