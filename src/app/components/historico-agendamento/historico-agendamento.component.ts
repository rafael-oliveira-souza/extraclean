import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-historico-agendamento',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './historico-agendamento.component.html',
  styleUrls: ['./historico-agendamento.component.scss']
})
export class HistoricoAgendamentoComponent implements OnInit {
  public agendamento: AgendamentoDTO[] = inject<AgendamentoDTO[]>(MAT_DIALOG_DATA);

  // Ligando o paginador à tabela
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['Título', 'Turno', 'Endereço', 'Metragem', 'Desconto', 
    'Valor', 'Data/Hora', 'Tipo de Limpeza', 'Extra Plus'];
  public dataSource = new MatTableDataSource<AgendamentoDTO>(this.agendamento);

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
