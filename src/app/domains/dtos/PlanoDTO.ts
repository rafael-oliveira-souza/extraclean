export class PlanoDTO {
    nome!: string;
    valor!: number;

    constructor(nome: string, valor: number) {
        this.nome = nome;
        this.valor = valor;
    }
}