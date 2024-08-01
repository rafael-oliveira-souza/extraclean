export class PlanoDTO {
    nome!: string;
    descricao!: string;
    valor!: number;

    constructor(nome: string, descricao: string, valor: number) {
        this.nome = nome;
        this.descricao = descricao;
        this.valor = valor;
    }
}