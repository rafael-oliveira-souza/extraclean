import { Pipe, PipeTransform } from '@angular/core';
import { SituacaoAgendamentoEnum } from '../domains/enums/SituacaoAgendamentoEnum';

@Pipe({
  name: 'situacaoAgendamento',
  standalone: true
})
export class SituacaoAgendamentoPipe implements PipeTransform {

  transform(value: string | number | SituacaoAgendamentoEnum): string {
    switch (value) {
      case 0:
        return "Criado";
      case "0":
        return "Criado";
      case SituacaoAgendamentoEnum.CRIADO:
        return "Criado";
      case 1:
        return "Em Análise";
      case "1":
        return "Em Análise";
      case SituacaoAgendamentoEnum.EM_ANALISE:
        return "Em Análise";
      case 2:
        return "Finalizado";
      case "2":
        return "Finalizado";
      case SituacaoAgendamentoEnum.FINALIZADO:
        return "Finalizado";
      default:
        return "";
    }
  }

}
