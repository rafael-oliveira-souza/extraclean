import { MomentInput } from "moment";
import { PagamentoDTO } from "./PagamentoDTO";

export class AgendamentoDTO extends PagamentoDTO {
    turno: number = 0;
    diasSelecionados: MomentInput[] = [];
    profissionalSelecionado: number = 0;
    endereco!: string;

    public getQtdDias() {
        return this.diasSelecionados.length;
    }

    public isSemAgendamento() {
        return this.diasSelecionados.length <= 0;
    }
}