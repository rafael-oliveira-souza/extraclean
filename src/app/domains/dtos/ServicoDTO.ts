export class ServicoDTO {
    nome!: string;
    titulo!: string;
    icone!: string;
    descricao!: string;
    imagem!: string;
    marcadoFeito: boolean = false;
    marcadoNaoFeito: boolean = false;

    constructor(nome: string, titulo: string, descricao: string, icone: string, imagem: string) {
        this.nome = nome;
        this.titulo = titulo;
        this.descricao = descricao;
        this.icone = icone;
        this.imagem = imagem;
    }
}