import { HorasEnum } from "../enums/HorasEnum";
import { SituacaoPlanoEnum } from "../enums/SituacaoPlanoEnum";
import { TipoPagamentoEnum } from "../enums/TipoPagamentoEnum";
import { TipoPlanoEnum } from "../enums/TipoPlanoEnum";
import { TipoServicoEnum } from "../enums/TipoServicoEnum";
import { TurnoEnum } from "../enums/TurnoEnum";

export class AgendamentoResumoDTO {
    planoId!: number;
    data!: Date;
    nomeContratante!: string;
    desconto!: number;
    endereco!: string;
    situacao!: SituacaoPlanoEnum;
    cpfCnpj!: string;
    valor!: number;
    tipoPagamento!: TipoPagamentoEnum;
    tipoPlano!: TipoPlanoEnum;

    agendamentoResumoDados: AgendamentoResumoDadosVO[] = [];
}

export class AgendamentoResumoDadosVO {
    data!: Date;
    turno: TurnoEnum = TurnoEnum.NAO_DEFINIDO;
    tipo: TipoServicoEnum = TipoServicoEnum.NAO_DEFINIDO;
    horas!: HorasEnum;
}