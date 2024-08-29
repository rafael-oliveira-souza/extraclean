export class PlanoDTO {
    nome!: string;
    descricao!: string;
    valorMetro!: number;
    qtdDias!: number;

    constructor(nome: string, descricao: string, valorMetro: number, qtdDias: number) {
        this.nome = nome;
        this.descricao = descricao;
        this.valorMetro = valorMetro;
        this.qtdDias = qtdDias;
    }
}