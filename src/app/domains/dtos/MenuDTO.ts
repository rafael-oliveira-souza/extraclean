export class MenuDTO {
    label: string;
    id: string;
    index: number;

    constructor(label: string, id: string, index: number) {
        this.label = label;
        this.id = id;
        this.index = index;
    }
}