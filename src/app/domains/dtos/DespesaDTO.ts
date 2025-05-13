export class DespesaDTO {
    id!: number;
    descricao!: string;
    usuarioId!: number | null;
    data!: Date | null;
    valor!: number | null;
    edit: boolean = false;
    tipo!: string;
}