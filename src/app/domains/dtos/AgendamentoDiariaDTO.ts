export class AgendamentoDiariaDTO {
    dataHora!: Date;
    turno!: number;

    constructor(dataHora: Date, turno: number) {
        this.dataHora = dataHora;
        this.turno = turno;
    }
}