import { Pipe, PipeTransform } from '@angular/core';
import { SituacaoPagamentoEnum } from '../domains/enums/SituacaoPagamentoEnum';

@Pipe({
  name: 'situacaoPagamento',
  standalone: true
})
export class SituacaoPagamentoPipe implements PipeTransform {

  transform(value: string | number | SituacaoPagamentoEnum): string {
    switch (value) {
      case 0:
        return "Criado";
      case "0":
        return "Criado";
      case SituacaoPagamentoEnum.CRIADO:
        return "Criado";
      case 1:
        return "Em Análise";
      case "1":
        return "Em Análise";
      case SituacaoPagamentoEnum.EM_ANALISE:
        return "Em Análise";
      case 2:
        return "Em Processo";
      case "2":
        return "Em Processo";
      case SituacaoPagamentoEnum.EM_PROCESSO:
        return "Em Processo";
      case 3:
        return "Aprovado";
      case "3":
        return "Aprovado";
      case SituacaoPagamentoEnum.APROVADO:
        return "Aprovado";
      case 4:
        return "Cancelado";
      case "4":
        return "Cancelado";
      case SituacaoPagamentoEnum.CANCELADO:
        return "Cancelado";
      case 5:
        return "Expirado";
      case "5":
        return "Expirado";
      case SituacaoPagamentoEnum.EXPIRADO:
        return "Expirado";
      case 6:
        return "Rejeitado";
      case "6":
        return "Rejeitado";
      case SituacaoPagamentoEnum.REJEITADO:
        return "Rejeitado";
      case 7:
        return "Reembolsado";
      case "7":
        return "Reembolsado";
      case SituacaoPagamentoEnum.REEMBOLSADO:
        return "Reembolsado";
      case 8:
        return "Estornado";
      case "8":
        return "Estornado";
      case SituacaoPagamentoEnum.ESTORNADO:
        return "Estornado";

      default:
        return "Não Definido";
    }
  }

}
