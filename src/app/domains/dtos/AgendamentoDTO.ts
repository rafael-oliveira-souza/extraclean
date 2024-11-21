import { MomentInput } from "moment";
import { PagamentoDTO } from "./PagamentoDTO";

export class AgendamentoDTO extends PagamentoDTO {
    turno: number = 0;
    diasSelecionados: MomentInput[] = [];
    profissionais: number[] = [];
    endereco!: string;
    ignoreQtdProfissionais: boolean = false;
    enviarEmail: boolean = false;
    gerarPagamento: boolean = true;
    localizacao!: string;
    observacao!: string;

    public getQtdDias() {
        return this.diasSelecionados ? this.diasSelecionados.length : 0;
    }

    public isSemAgendamento() {
        return this.diasSelecionados ? this.diasSelecionados.length <= 0 : false;
    }
}