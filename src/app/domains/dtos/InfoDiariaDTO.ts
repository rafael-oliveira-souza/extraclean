export class InfoDiariaDTO {
    nomeCliente: string = '';
    email: string = '';
    telefone: string = '';
    endereco: string = '';
    numero: string = '';
    cep: string = '';
    localizacao: string = '';
    observacao: string = '';
    valor: number = 0;
    desconto: number = 0;
    turno: string = '';
    horas: string = '';
    tipoLimpeza: string = '';
    idDiarista!: number;
    dataDiaria!: Date;
}