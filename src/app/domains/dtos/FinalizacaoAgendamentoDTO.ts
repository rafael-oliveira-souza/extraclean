export class FinalizacaoAgendamentoDTO {
    codigoPagamento: string = '';
    dataDiaria!: Date;
    idDiaria !: number;
    idCliente !: number;
    dataReagendamento!: Date | null;
    idProfissional !: number;
    idProfissionalAtualizado !: number;
}