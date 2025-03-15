export class ClienteDTO {
    id!: number;
    nome!: string;
    sobrenome!: string;
    email!: string;
    telefone!: string;
    endereco!: string;
    numero!: string;
    localizacao!: string;
    cep!: string;
    cpf!: string;
    dataNascimento!: Date;
    tipo!: number;

    public isValido() {
        return this.nome &&
            this.sobrenome &&
            this.email &&
            this.telefone &&
            this.endereco &&
            this.numero &&
            this.cep;
    }
}