export class ProfissionalDTO {
    nome!: string;
    id!: number;

    constructor(id: number, nome: string) {
        this.id = id;
        this.nome = nome;
    }

    public static empty(): ProfissionalDTO {
        return new ProfissionalDTO(0, "");
    }
}