import { HorasEnum } from "../enums/HorasEnum";
import { TurnoEnum } from "../enums/TurnoEnum";

export class AgendamentoPagamentoInfoDTO {
    turno: TurnoEnum = TurnoEnum.NAO_DEFINIDO;
    metragem: number = 0;
    valor: number = 0;
    horas: HorasEnum = HorasEnum.NAO_DEFINIDO;
    total: number = 0;
    desconto: number = 0;
    numProfissionais: number = 1;
    valorProfissionais: number = 0;
    porcentagemProfissionais: number = 65;
}