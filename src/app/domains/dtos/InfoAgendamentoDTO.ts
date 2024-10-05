import { HorasEnum } from "../enums/HorasEnum";
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
    porcentagem!: number;
    endereco!: string;
    situacaoPagamento!: SituacaoPagamentoEnum;
    linkPagamento!: string;
    localizacao!: string;
    codigoPagamento!: string;
    idCliente!: number;
    idProfissional!: number;
    dataReagendamento!: Date | null;
    entrada!: Date | null;
    saida!: Date | null;
    qtdProfissionais!: number;
    valorProfissional!: number;
    profissionalAtualizado!: number;
    horas: HorasEnum = HorasEnum.NAO_DEFINIDO;
}