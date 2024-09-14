import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

@Injectable()
export class MatPaginatorCustom extends MatPaginatorIntl {
    constructor() {
        super();
        this.nextPageLabel = 'Próximo';
        this.previousPageLabel = 'Anterior';
        this.itemsPerPageLabel = 'Quantidade de Items';
    }

}