import { MomentInput } from "moment";
import { TipoPlanoEnum } from "../enums/TipoPlanoEnum";
import { PagamentoDTO } from "./PagamentoDTO";

export class PlanoDTO extends PagamentoDTO {
    nome!: string;
    descricao!: string;
    qtdDias!: number;
    diasSelecionados: MomentInput[] = [];

    constructor(id: TipoPlanoEnum, nome: string, descricao: string, desconto: number, qtdDias: number, qtdParcelas: number = 1) {
        super();
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.desconto = desconto;
        this.qtdDias = qtdDias;
        this.qtdParcelas = qtdParcelas;
    }
}