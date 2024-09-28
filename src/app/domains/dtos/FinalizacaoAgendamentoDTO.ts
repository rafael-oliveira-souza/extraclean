export class FinalizacaoAgendamentoDTO {
    codigoPagamento: string = '';
    dataDiaria!: Date;
    idCliente !: number;
    dataReagendamento!: Date | null;
}