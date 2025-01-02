import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ProfissionalService } from '../../services/profissional.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { DateUtils } from '../../utils/DateUtils';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PipeModule } from '../../pipes/pipe.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PagamentoProfissionalDTO } from '../../domains/dtos/PagamentoProfissionalDTO';

@Component({
  selector: 'app-pagamento-profissional',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    PipeModule,
  ],
  templateUrl: './pagamento-profissional.component.html',
  styleUrls: ['./pagamento-profissional.component.scss']
})
export class PagamentoProfissionalComponent implements OnInit {

  @Input('profissionais')
  public profissionais: ProfissionalDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = ['nomeDiarista', 'nome', 'data', 'valor', 'acao'];
  public profissionalSelecionado: number | null = null;
  public valor: number | null = null;
  public periodoPagamento: Date | null = new Date();
  public data: Date | null = null;
  public nome: string = "";

  public dataSource = new MatTableDataSource<PagamentoProfissionalDTO>();
  public pagamentos: PagamentoProfissionalDTO[] = [];

  constructor(private profissionalService: ProfissionalService,
    private _notificacaoService: NotificacaoService
  ) { }

  ngOnInit() {
    this.recuperarValores();
  }

  public salvar() {
    let pagamento = new PagamentoProfissionalDTO();
    pagamento.data = new Date();
    pagamento.diaristaId = this.profissionalSelecionado;
    pagamento.valor = this.valor;
    pagamento.nome = this.nome;

    if (this.data) {
      pagamento.data = this.data;
    }

    this.profissionalService.salvarPagamentoProfissional(pagamento)
      .subscribe((result: any) => {
        this._notificacaoService.alerta("Pagamento criado com sucesso!");
        this.recuperarValores();
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao criar pagamento.");
      });
  }

  public atualizar(pagamento: PagamentoProfissionalDTO) {
    this.profissionalService.salvarPagamentoProfissional(pagamento)
      .subscribe((result: any) => {
        this._notificacaoService.alerta("Pagamento atualizado com sucesso!");
        this.recuperarValores();
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao atualizar pagamento.");
      });
  }

  public excluir(pagamento: PagamentoProfissionalDTO) {
    this.profissionalService.excluirPagamentoProfissional(pagamento)
      .subscribe((result: any) => {
        this._notificacaoService.alerta("Pagamento excluido com sucesso!");
        this.recuperarValores();
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao excluir pagamento.");
      });
  }

  public limpar() {
    this.profissionalSelecionado = null;
    this.data = null;
    this.valor = null;
    this.nome = "";
  }

  public recuperarValores() {
    const datas: Date[] = DateUtils.datesInMonth(this.periodoPagamento);
    const dataIni = DateUtils.format(datas[0], DateUtils.ES);
    const dataF = DateUtils.format(datas[datas.length - 1], DateUtils.ES);
    this.profissionalService.recuperarTodosPagamentosProfissionais(dataIni, dataF)
      .subscribe((pagamentos: PagamentoProfissionalDTO[]) => {
        this.pagamentos = pagamentos;
        this.filtrarTabela();
      });
  }

  public filtrarTabela() {
    if (this.profissionalSelecionado) {
      const pagFiltrado: PagamentoProfissionalDTO[] = this.pagamentos
        .filter(pag => pag.diaristaId == this.profissionalSelecionado);
      this.dataSource = new MatTableDataSource<PagamentoProfissionalDTO>(pagFiltrado);
    } else {
      this.dataSource = new MatTableDataSource<PagamentoProfissionalDTO>(this.pagamentos);
    }
    this.dataSource.paginator = this.paginator;
  }

  public getNome(id: number): string {
    let prof: ProfissionalDTO[] = this.profissionais.filter(prof => prof.id == id);
    if (prof && prof.length > 0) {
      return prof[0].nome;
    } else {
      return "";
    }
  }
}
