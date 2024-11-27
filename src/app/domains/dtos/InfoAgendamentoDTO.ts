import { HorasEnum } from "../enums/HorasEnum";
import { SituacaoAgendamentoEnum } from "../enums/SituacaoAgendamentoEnum";
import { SituacaoDiariaEnum } from "../enums/SituacaoDiariaEnum";
import { SituacaoPagamentoEnum } from "../enums/SituacaoPagamentoEnum";
import { TipoServicoEnum } from "../enums/TipoServicoEnum";
import { TurnoEnum } from "../enums/TurnoEnum";

export class InfoAgendamentoDTO {
    nomeCliente!: string;
    nomeDiarista!: string;
    dataDiaria!: Date;
    situacao!: SituacaoDiariaEnum;
    situacaoAgendamento!: SituacaoAgendamentoEnum;
    tipoLimpeza!: TipoServicoEnum;
    turno!: TurnoEnum;
    metragem!: number;
    valor!: number;
    desconto!: number;
    porcentagem!: number;
    endereco!: string;
    situacaoPagamento!: SituacaoPagamentoEnum;
    linkPagamento!: string;
    localizacao!: string;
    observacao!: string;
    codigoPagamento!: string;
    idCliente!: number;
    idDiaria!: number;
    idProfissional!: number;
    dataReagendamento!: Date | null;
    entrada!: Date | null;
    saida!: Date | null;
    contratada!: boolean;
    qtdProfissionais!: number;
    valorProfissional!: number;
    profissionalAtualizado!: number;
    valorRealAgendamento!: number;
    horas: HorasEnum = HorasEnum.NAO_DEFINIDO;
    open: boolean = false;
}