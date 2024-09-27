import { SituacaoDiariaEnum } from "../enums/SituacaoDiariaEnum";
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
}