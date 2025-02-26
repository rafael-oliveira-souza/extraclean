import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatCalendarView, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
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
import { SituacaoPagamentoEnum } from '../../domains/enums/SituacaoPagamentoEnum';
import { HorasEnum } from '../../domains/enums/HorasEnum';
import { ProfissionalService } from '../../services/profissional.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule,
    MatInputModule,
    PipeModule,
  ],
  templateUrl: './historico-admin.component.html',
  styleUrls: ['./historico-admin.component.scss']
})
export class HistoricoAdminComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input('profissionais')
  public profissionais: ProfissionalDTO[] = [];

  public agendamentos: InfoAgendamentoDTO[] = [];

  public exibeTotais: boolean = true;
  public indice: number = 0;
  public profissionalSelecionado: string = "";
  public clienteSelecionado: string = "";
  public situacao!: SituacaoDiariaEnum;
  public situacaoPagamento!: SituacaoPagamentoEnum;
  public dataSource = new MatTableDataSource<InfoAgendamentoDTO>();
  public dataInicio: Date = DateUtils.newDate();
  public dataMin: Date = DateUtils.toMoment().add(-3, 'month').toDate();
  public dataMax: Date = DateUtils.toMoment().add(1, 'year').toDate();
  public situacoesPagamento: { nome: string, id: number }[] = [
    { nome: 'Em Analise', id: 1 },
    { nome: 'Aprovado', id: 3 },
    { nome: 'Cancelado', id: 4 },
    { nome: 'Expirado', id: 5 },
  ];

  public situacoes: { nome: string, id: number }[] = [
    { nome: 'Agendada', id: 1 },
    { nome: 'Reagendada', id: 4 },
    { nome: 'Finalizada', id: 2 }
  ];

  public displayedColumns: string[] = [];

  constructor(private _agendamentoService: AgendamentoService,
    private _profissionalService: ProfissionalService,
    private _notificacaoService: NotificacaoService) {

    if (this.isNotXs()) {
      this.displayedColumns = [
        'nomeCliente', 'nomeDiarista', 'dataDiaria', 'situacao',
        'tipoLimpeza', 'horas', 'turno', 'valor', 'desconto', 'valorProfissional'
      ];
    } else {
      this.displayedColumns = ['nomeCliente', 'dataDiaria', 'valorProfissional'];
    }
  }

  ngAfterViewInit() {
    this.buscarAgendamentos();
  }

  // public recuperarProfissionais() {
  //   this._profissionalService.todos()
  //     .subscribe((prof: Array<ProfissionalDTO>) => {
  //       this.profissionais = prof;
  //       this.buscarAgendamentos();
  //     });
  // }

  public atualizarBusca() {
    const agendamentos = this.ordernarDecrescente(this.agendamentos)
      .filter(agend => !this.situacaoPagamento || agend.situacaoPagamento == this.situacaoPagamento)
      .filter(agend => !this.clienteSelecionado || agend.nomeCliente.toLowerCase().includes(this.clienteSelecionado.toLowerCase()))
      .filter(agend => !this.profissionalSelecionado || agend.nomeDiarista.toLowerCase() == this.profissionalSelecionado.toLowerCase())
      .filter(agend => !this.situacao || agend.situacao == this.situacao);

    this.dataSource = new MatTableDataSource<InfoAgendamentoDTO>(agendamentos);
    this.dataSource.paginator = this.paginator;
  }

  private ordernarDecrescente(agendamentos: InfoAgendamentoDTO[]) {
    return agendamentos;
    // return agendamentos.sort((a, b) => DateUtils.toDate(b.dataDiaria).getTime() - DateUtils.toDate(a.dataDiaria).getTime());
  }

  private buscarAgendamentos() {
    const datas: Date[] = DateUtils.datesInMonth(this.dataInicio);
    const dataIni = DateUtils.format(datas[0], DateUtils.ES);
    const dataF = DateUtils.format(datas[datas.length - 1], DateUtils.ES);
    let map = new Map<string, InfoAgendamentoDTO>();

    this._agendamentoService.recuperarInfoAgendamentos(dataIni, dataF, null)
      .subscribe((agendamentos: InfoAgendamentoDTO[]) => {
        agendamentos
        .filter(agend => agend.situacao != SituacaoDiariaEnum.CANCELADA)
        .forEach(agend => {
          let key = agend.codigoPagamento + "_" +
            agend.dataDiaria + "_" +
            agend.idProfissional + "_" +
            agend.idCliente;

          if (map.has(key)) {
          } else {
            map.set(key, agend);
          }
        });

        this.agendamentos = [];
        map.forEach((agend) => this.agendamentos.push(agend));
        // this.agendamentos = agendamentos;
        // this.profissionaisSelecionados = this.agendamentos
        //   .map(agend => agend.nomeDiarista)
        //   .filter((value, index, self) => self.indexOf(value) === index);

        this.agendamentos = this.ordernarDecrescente(this.agendamentos.filter(agend =>
          agend.situacao != SituacaoDiariaEnum.CANCELADA));

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

  public setDate(element: any) {
    const date = element.target.value;
    if (date && date.length == 7) {
      this.dataInicio = DateUtils.toMoment(date, 'MM/YYYY').toDate();
      this.buscarAgendamentos();
    }
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
    this.dataSource.data.forEach(value => {
      total += value.valorRealAgendamento;
    });

    return total;
  }

  public calcularDescontos() {
    let total = 0;
    this.dataSource.data.forEach(value => {
      total += value.desconto;
    });

    return total;
  }

  public calcularTotalComDescontos() {
    let total = 0;
    this.dataSource.data.forEach(value => {
      total += value.valorRealAgendamento - value.desconto;
    });

    return total;
  }

}
