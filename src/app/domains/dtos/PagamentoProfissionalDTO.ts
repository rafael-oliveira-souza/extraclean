export class PagamentoProfissionalDTO {
    id!: number;
    nome!: string;
    diaristaId!: number | null;
    data!: Date | null;
    valor!: number | null;
    edit: boolean = false;
}