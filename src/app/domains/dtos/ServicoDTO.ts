export class ServicoDTO {
    nome!: string;
    icone!: string;
    descricao!: string;

    constructor(nome: string, descricao: string, icone: string) {
        this.nome = nome;
        this.descricao = descricao;
        this.icone = icone;
    }
}