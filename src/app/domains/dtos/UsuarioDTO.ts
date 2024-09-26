export class UsuarioDTO {
    email!: string;
    senha!: string;
    senhaAntiga!: string;
    autenticado: boolean = false;
}