import { FormaPagamentoEnum } from "../enums/FormaPagamentoEnum";
import { OrigemPagamentoEnum } from "../enums/OrigemPagamentoEnum";
import { TipoLimpezaEnum } from "../enums/TipoLimpezaEnum";
import { TipoPlanoEnum } from "../enums/TipoPlanoEnum";

export class PagamentoDTO {
    id!: number;
    titulo!: string;
    qtdParcelas!: number;
    codigoPagamento!: string;
    metragem!: number;
    desconto: number = 0;
    valor: number = 0;
    dataHora!: Date;
    email: string = "";
    quantidadeItens!: number;
    formaPagamento!: FormaPagamentoEnum;
    tipoLimpeza!: TipoLimpezaEnum;
    tipoPagamento!: string;
    origem!: OrigemPagamentoEnum;
    tipoPlano!: TipoPlanoEnum;
    extraPlus: boolean = false;
}