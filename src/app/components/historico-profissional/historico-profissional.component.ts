import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AgendamentoService } from '../../services/agendamento.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { HistoricoAgendamentoComponent } from '../historico-agendamento/historico-agendamento.component';
import { InfoAgendamentoDTO } from '../../domains/dtos/InfoAgendamentoDTO';
import { DateUtils } from '../../utils/DateUtils';
import { PipeModule } from '../../pipes/pipe.module';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { CommonModule } from '@angular/common';
import { SituacaoDiariaEnum } from '../../domains/enums/SituacaoDiariaEnum';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { TituloComponent } from '../titulo/titulo.component';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-historico-profissional',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatDatepickerModule,
    MatPaginatorModule,
    PipeModule,
    TituloComponent
  ],
  templateUrl: './historico-profissional.component.html',
  styleUrls: ['./historico-profissional.component.scss']
})
export class HistoricoProfissionalComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly data: any = inject<InfoAgendamentoDTO[]>(MAT_DIALOG_DATA);
  public agendamentos: InfoAgendamentoDTO[] = [];
  public nomeProfissional: string = this.data['nomeProfissional'];
  public tipoCliente: number = this.data['tipoCliente'];
  public email: string = this.data['email'];

  public indice: number = 0;
  public dataSource = new MatTableDataSource<InfoAgendamentoDTO>();
  public dataInicio: Date = new Date();
  public dataFim: Date = new Date();

  public displayedColumns: string[] = [];

  constructor(private _agendamentoService: AgendamentoService,
    private _notificacaoService: NotificacaoService,
    private _dialogRef: MatDialogRef<HistoricoAgendamentoComponent>) {
    if (this.isNotXs()) {
      this.displayedColumns = [
        'nomeCliente', 'dataDiaria', 'situacao',
        'tipoLimpeza', 'turno', 'valor', 'valorProfissional'
      ];
    } else {
      this.displayedColumns = ['dataDiaria', 'valorProfissional'];
    }
  }

  ngAfterViewInit() {
    const datas: Date[] = DateUtils.datesInMonth(this.dataInicio);
    const dataIni = DateUtils.format(datas[0], DateUtils.ES);
    const dataF = DateUtils.format(datas[datas.length - 1], DateUtils.ES);
    this._agendamentoService.recuperarInfoAgendamentos(dataIni, dataF, this.email)
      .subscribe((agendamentos: InfoAgendamentoDTO[]) => {
        this.agendamentos = agendamentos.filter(agend => (agend.situacao == SituacaoDiariaEnum.FINALIZADA || agend.situacao == SituacaoDiariaEnum.AGENDADA));
        this.dataSource = new MatTableDataSource<InfoAgendamentoDTO>(this.agendamentos);
        this.dataSource.paginator = this.paginator;
      }, (error: any) => {
        this._notificacaoService.erro(error);
      });
  }

  public isNotXs(): boolean {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return !CalculoUtils.isXs(documentWidth);
    }

    return true;
  }

}
