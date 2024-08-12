export class ProfissionalDTO {
    nome!: string;
    id!: number;
    porcentagem!: number;
    sobrenome: string = '';
    cpfCnpj: string = '';
    email: string = '';
    telefone: string = '';
    endereco: string = '';
    dataNascimento!: Date;
    segundaDisponivel: boolean = true;
    tercaDisponivel: boolean = true;
    quartaDisponivel: boolean = true;
    quintaDisponivel: boolean = true;
    sextaDisponivel: boolean = true;
    sabadoDisponivel: boolean = false;
    domingoDisponivel: boolean = false;

    constructor(id: number, nome: string) {
        this.id = id;
        this.nome = nome;
    }

    public static empty(): ProfissionalDTO {
        return new ProfissionalDTO(0, "");
    }
}