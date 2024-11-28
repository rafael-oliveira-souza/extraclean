import { PagamentoProfissionalDTO } from "./PagamentoProfissionalDTO";

export class ContraChequeProfissionalDTO {
    desconto!: number;
    diaristaId!: number | null;
    dataInicio!: Date | null;
    dataFim!: Date | null;
    valor!: number | null;
    pagamentos: PagamentoProfissionalDTO[] = [];
}
