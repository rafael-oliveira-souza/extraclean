import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Moment } from 'moment';
import { InfoAgendamentoDTO } from '../../domains/dtos/InfoAgendamentoDTO';
import { SituacaoDiariaEnum } from '../../domains/enums/SituacaoDiariaEnum';
import { AgendamentoService } from '../../services/agendamento.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { DateUtils } from '../../utils/DateUtils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LinguagemEnum } from '../../domains/enums/LinguagemEnum';
import { PipeModule } from '../../pipes/pipe.module';
import { MY_FORMATS } from '../calendario/calendario.component';
import { TituloComponent } from '../titulo/titulo.component';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { ProfissionalComponent } from '../profissional/profissional.component';

@Component({
  selector: 'app-historico-admin',
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
    TituloComponent,
    ProfissionalComponent,
  ],
  templateUrl: './historico-admin.component.html',
  styleUrls: ['./historico-admin.component.scss']
})
export class HistoricoAdminComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public agendamentos: InfoAgendamentoDTO[] = [];

  public indice: number = 0;
  public profissionalSelecionado: string = "";
  public profissionais: string[] = [];
  public dataSource = new MatTableDataSource<InfoAgendamentoDTO>();
  public dataInicio: Date = new Date();
  public dataMin: Date = DateUtils.toMoment().add(-3, 'month').toDate();
  public dataMax: Date = DateUtils.toMoment().add(1, 'year').toDate();

  public displayedColumns: string[] = [];

  constructor(private _agendamentoService: AgendamentoService,
    private _notificacaoService: NotificacaoService) {
    if (this.isNotXs()) {
      this.displayedColumns = [
        'nomeCliente', 'nomeDiarista', 'dataDiaria', 'situacao',
        'tipoLimpeza', 'turno', 'valor', 'valorProfissional'
      ];
    } else {
      this.displayedColumns = ['nomeCliente', 'dataDiaria', 'valorProfissional'];
    }
  }

  ngAfterViewInit() {
    this.buscarAgendamentos();
  }

  public recuperarProfissional() {
    if (this.profissionalSelecionado) {
      const agendamentos = this.agendamentos.filter(agend => agend.nomeDiarista == this.profissionalSelecionado);
      this.dataSource = new MatTableDataSource<InfoAgendamentoDTO>(agendamentos);
    } else {
      this.dataSource = new MatTableDataSource<InfoAgendamentoDTO>(this.agendamentos);
    }

    this.dataSource.paginator = this.paginator;

  }

  private buscarAgendamentos() {
    const datas: Date[] = DateUtils.datesInMonth(this.dataInicio);
    const dataIni = DateUtils.format(datas[0], DateUtils.ES);
    const dataF = DateUtils.format(datas[datas.length - 1], DateUtils.ES);
    this._agendamentoService.recuperarInfoAgendamentos(dataIni, dataF, null)
      .subscribe((agendamentos: InfoAgendamentoDTO[]) => {
        this.agendamentos = agendamentos;
        this.profissionais = this.agendamentos
          .map(agend => agend.nomeDiarista)
          .filter((value, index, self) => self.indexOf(value) === index);

        this.agendamentos = agendamentos.filter(agend => agend.situacao == SituacaoDiariaEnum.FINALIZADA
          || agend.situacao == SituacaoDiariaEnum.AGENDADA
          || agend.situacao == SituacaoDiariaEnum.NAO_AGENDADA
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

  public calcularTotalProfissional() {
    let total = 0;
    this.dataSource.data.forEach(agend => {
      if (!agend.contratada) {
        total += agend.valorProfissional;
      }
    });
    return total;
  }

  public calcularTotal() {
    let total = 0;
    let map = new Map<string, number>();
    this.dataSource.data.forEach(value => {
      if (!map.has(value.codigoPagamento)) {
        map.set(value.codigoPagamento, value.valor);
      }
    });

    map.forEach((valor) => total += valor);
    return total;
  }

}
