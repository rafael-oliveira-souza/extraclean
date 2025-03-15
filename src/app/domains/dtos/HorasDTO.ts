import { HorasEnum } from "../enums/HorasEnum";

export class HorasDTO {
    id!: HorasEnum;
    valor!: number;
    descricao!: string;
    numProfissionais!: number;

    constructor() {
        this.id = HorasEnum.NAO_DEFINIDO;
        this.valor = 0;
        this.numProfissionais = 0;
    }
}