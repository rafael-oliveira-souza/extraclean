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
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { TituloComponent } from '../titulo/titulo.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LinguagemEnum } from '../../domains/enums/LinguagemEnum';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-historico-profissional',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: LinguagemEnum.PT },
    provideMomentDateAdapter(MY_FORMATS),
  ],
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
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
  public dataMin: Date = DateUtils.toMoment().add(-3, 'month').toDate();
  public dataMax: Date = DateUtils.toMoment().add(1, 'year').toDate();

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
    this.buscarAgendamentos();
  }

  private buscarAgendamentos() {
    const datas: Date[] = DateUtils.datesInMonth(this.dataInicio);
    const dataIni = DateUtils.format(datas[0], DateUtils.ES);
    const dataF = DateUtils.format(datas[datas.length - 1], DateUtils.ES);
    this._agendamentoService.recuperarInfoAgendamentos(dataIni, dataF, this.email)
      .subscribe((agendamentos: InfoAgendamentoDTO[]) => {
        this.agendamentos = agendamentos.filter(agend => agend.situacao == SituacaoDiariaEnum.FINALIZADA
          || agend.situacao == SituacaoDiariaEnum.AGENDADA
          || agend.situacao == SituacaoDiariaEnum.REAGENDADA);
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

  public setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = DateUtils.toMoment(this.dataInicio);
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dataInicio = ctrlValue.toDate();
    datepicker.close();
    this.buscarAgendamentos();
  }

  public calcularTotal() {
    let total = 0;
    this.agendamentos.forEach(agend => total += agend.valorProfissional);
    return total;
  }

}
