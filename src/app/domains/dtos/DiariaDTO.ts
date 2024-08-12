export class DiariaDTO {
    nome: string = '';
    endereco: string = '';
    valor: number = 0;
    turno: string = '';
    metragem: number = 0;
    desconto: number = 0;
    total: number = 0;
    diaristas: number[] = [];
    dataHora!: Date;
    clienteId !: number;

}