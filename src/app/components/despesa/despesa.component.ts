import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NotificacaoService } from '../../services/notificacao.service';
import { DateUtils } from '../../utils/DateUtils';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PipeModule } from '../../pipes/pipe.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DespesaService } from '../../services/despesa.service';
import { DespesaDTO } from '../../domains/dtos/DespesaDTO';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { ClienteDespesaDTO } from '../../domains/dtos/ClienteDespesaDTO';
import { TipoDespesaEnum } from '../../domains/enums/TipoDespesaEnum';

@Component({
  selector: 'app-despesas',
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
  templateUrl: './despesa.component.html',
  styleUrls: ['./despesa.component.scss']
})
export class DespesasComponent implements OnInit {

  public clientesDisponiveis: Array<ClienteDespesaDTO> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns: string[] = ['nomeUsuario', 'descricao', 'tipo', 'data', 'valor', 'acao'];
  public usuarioSelecionado: number | null = null;
  public valor: number | null = null;
  public periodoPagamento: Date | null = new Date();
  public data: Date | null = null;
  public descricao: string = "";
  public tipoDespesa: TipoDespesaEnum = TipoDespesaEnum.OPERACIONAL;
  
  public dataSource = new MatTableDataSource<DespesaDTO>();
  public despesas: DespesaDTO[] = [];

  constructor(private despesaService: DespesaService,
    private _notificacaoService: NotificacaoService
  ) { }

  ngOnInit() {
    this.recuperarValores();
    this.recuperarFuncionariosAtivos();
  }

  recuperarFuncionariosAtivos() {
    this.despesaService.recuperarFuncionariosAtivos()
      .subscribe((result: any) => {
        this.clientesDisponiveis = result;
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao recuperar funcionarios.");
      });
  }

  public salvar() {
    if (this.valor) {
      this.valor = parseFloat(this.valor.toString().replaceAll(",", "."));
    }

    let despesa = new DespesaDTO();
    despesa.data = new Date();
    despesa.usuarioId = this.usuarioSelecionado;
    despesa.valor = this.valor;
    despesa.descricao = this.descricao;
    despesa.tipo = this.tipoDespesa;

    if (this.data) {
      despesa.data = this.data;
    }

    this.despesaService.salvar(despesa)
      .subscribe((result: any) => {
        this._notificacaoService.alerta("Despesa criada com sucesso!");
        this.recuperarValores();
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao criar despesa.");
      });
  }

  public atualizar(despesa: DespesaDTO) {
    if (despesa && despesa.valor) {
      despesa.valor = parseFloat(despesa.valor.toString().replaceAll(",", "."));
    }

    this.despesaService.salvar(despesa)
      .subscribe((result: any) => {
        this._notificacaoService.alerta("Despesa atualizada com sucesso!");
        this.recuperarValores();
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao atualizar despesa.");
      });
  }

  public excluir(despesa: DespesaDTO) {
    this.despesaService.excluir(despesa)
      .subscribe((result: any) => {
        this._notificacaoService.alerta("Despesa excluido com sucesso!");
        this.recuperarValores();
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao excluir despesa.");
      });
  }

  public limpar() {
    this.usuarioSelecionado = null;
    this.data = null;
    this.valor = null;
    this.descricao = "";
  }

  public recuperarValores() {
    const datas: Date[] = DateUtils.datesInMonth(this.periodoPagamento);
    const dataIni = DateUtils.format(datas[0], DateUtils.ES);
    const dataF = DateUtils.format(datas[datas.length - 1], DateUtils.ES);
    this.despesaService.recuperarPorPeriodo(dataIni, dataF)
      .subscribe((despesas: DespesaDTO[]) => {
        this.despesas = despesas;
        this.filtrarTabela();
      });
  }

  public filtrarTabela() {
    if (this.usuarioSelecionado) {
      const pagFiltrado: DespesaDTO[] = this.despesas
        .filter(pag => pag.usuarioId == this.usuarioSelecionado);
      this.dataSource = new MatTableDataSource<DespesaDTO>(pagFiltrado);
    } else {
      this.dataSource = new MatTableDataSource<DespesaDTO>(this.despesas);
    }
    this.dataSource.paginator = this.paginator;
  }

  public getNome(id: number): string {
    let cliente: ClienteDespesaDTO[] = this.clientesDisponiveis.filter(cliente => cliente.usuarioId == id);
    if (cliente && cliente.length > 0) {
      return cliente[0].nome;
    } else {
      return "";
    }
  }
}
