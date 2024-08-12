import { MomentInput } from "moment";
import { ProfissionalDTO } from "./ProfissionalDTO";

export class AgendamentoDTO {
    turno: number = 0;
    metragem: number = 0;
    desconto: number = 0;
    total: number = 0;
    valor: number = 0;
    diasSelecionados: MomentInput[] = [];
    profissional: ProfissionalDTO = ProfissionalDTO.empty();

    public getQtdDias() {
        return this.diasSelecionados.length;
    }

    public isSemAgendamento() {
        return this.diasSelecionados.length <= 0;
    }
}