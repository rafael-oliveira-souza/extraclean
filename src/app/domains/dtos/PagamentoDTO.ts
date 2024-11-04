import { FormaPagamentoEnum } from "../enums/FormaPagamentoEnum";
import { HorasEnum } from "../enums/HorasEnum";
import { OrigemPagamentoEnum } from "../enums/OrigemPagamentoEnum";
import { TipoServicoEnum } from "../enums/TipoServicoEnum";
import { TipoPlanoEnum } from "../enums/TipoPlanoEnum";
import { TipoPagamentoEnum } from "../enums/TipoPagamentoEnum";

export class PagamentoDTO {
    id!: number;
    titulo!: string;
    qtdParcelas!: number | undefined;
    codigoPagamento!: string;
    horas: HorasEnum = HorasEnum.NAO_DEFINIDO;
    metragem!: number;
    desconto: number = 0;
    valor: number = 0;
    dataHora!: Date;
    email: string | null | undefined = "";
    quantidadeItens!: number;
    formaPagamento!: FormaPagamentoEnum;
    tipoLimpeza!: TipoServicoEnum;
    tipoPagamento!: TipoPagamentoEnum;
    origem!: OrigemPagamentoEnum;
    tipoPlano!: TipoPlanoEnum;
    extraPlus: boolean = false;
    dataExpiracaoPagamento!: Date;
    isDetalhada: boolean = this.tipoLimpeza == TipoServicoEnum.DETALHADA;
    
}