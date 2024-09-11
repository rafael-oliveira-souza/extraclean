import { MomentInput } from "moment";
import { PagamentoDTO } from "./PagamentoDTO";

export class AgendamentoDTO extends PagamentoDTO {
    turno: number = 0;
    diasSelecionados: MomentInput[] = [];
    profissionais: number[] = [];
    endereco!: string;
    ignoreQtdProfissionais: boolean = false;

    public getQtdDias() {
        return this.diasSelecionados.length;
    }

    public isSemAgendamento() {
        return this.diasSelecionados.length <= 0;
    }
}