import { SituacaoDiariaEnum } from "../enums/SituacaoDiariaEnum";
import { SituacaoPagamentoEnum } from "../enums/SituacaoPagamentoEnum";
import { TipoLimpezaEnum } from "../enums/TipoLimpezaEnum";
import { TurnoEnum } from "../enums/TurnoEnum";

export class InfoAgendamentoDTO {
    nomeCliente!: string;
    nomeDiarista!: string;
    dataDiaria!: Date;
    situacao!: SituacaoDiariaEnum;
    tipoLimpeza!: TipoLimpezaEnum;
    turno!: TurnoEnum;
    metragem!: number;
    valor!: number;
    desconto!: number;
    endereco!: string;
    situacaoPagamento!: SituacaoPagamentoEnum;
    linkPagamento!: string;
    localizacao!: string;
    codigoPagamento!: string;
    idCliente!: number;
    dataReagendamento!: Date | null;
    entrada!: Date | null;
    saida!: Date | null;
}