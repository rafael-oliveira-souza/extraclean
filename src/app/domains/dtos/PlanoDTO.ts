import { PagamentoDTO } from "./PagamentoDTO";

export class PlanoDTO extends PagamentoDTO {
    nome!: string;
    descricao!: string;
    valorMetro!: number;
    qtdDias!: number;

    constructor(id: number, nome: string, descricao: string, valorMetro: number, qtdDias: number) {
        super();
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.valorMetro = valorMetro;
        this.qtdDias = qtdDias;
    }
}