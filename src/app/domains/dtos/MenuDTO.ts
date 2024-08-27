export class MenuDTO {
    label: string;
    id: string;
    selected: boolean;

    constructor(label: string, id: string, selected: boolean) {
        this.label = label;
        this.id = id;
        this.selected = selected;
    }
}