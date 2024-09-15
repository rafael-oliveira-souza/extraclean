export class AutenticacaoDTO {
    creationDate!: Date;
    expirationDate!: Date;
    autenticado: boolean = false;
    username!: string;
    token!: string;
    tipoUsuario!: number;

    constructor() { }
}