import { SituacaoPagamentoEnum } from "../enums/SituacaoPagamentoEnum";

export class PagamentoMpDTO {
    codigoPagamento!: string;
    idPreferencia!: string;
    idPagamento!: number;
    url!: string;
    situacaoPagamento!: SituacaoPagamentoEnum;
}