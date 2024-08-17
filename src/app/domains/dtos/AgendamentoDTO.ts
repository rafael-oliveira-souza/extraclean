import { MomentInput } from "moment";
import { ProfissionalDTO } from "./ProfissionalDTO";

export class AgendamentoDTO {
    turno: number = 0;
    metragem: number = 0;
    desconto: number = 0;
    total: number = 0;
    valor: number = 0;
    diasSelecionados: MomentInput[] = [];
    profissionalSelecionado: ProfissionalDTO = ProfissionalDTO.empty();
    profissionais: ProfissionalDTO[] = [];
    endereco: string = "";
    clienteId: number = 0;

    public getQtdDias() {
        return this.diasSelecionados.length;
    }

    public isSemAgendamento() {
        return this.diasSelecionados.length <= 0;
    }
}