export class AgendamentoDiariaDTO {
    dataHora!: Date;
    turno!: number;
    profissionais!: number[];

    constructor(dataHora: Date, turno: number, profissionais: number[]) {
        this.dataHora = dataHora;
        this.turno = turno;
        this.profissionais = profissionais;
    }

}