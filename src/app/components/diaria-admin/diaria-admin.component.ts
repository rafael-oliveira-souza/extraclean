import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { ClienteService } from '../../services/cliente.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PipeModule } from '../../pipes/pipe.module';
import { MomentInput } from 'moment';
import { DiariaDTO } from '../../domains/dtos/DiariaDTO';
import { InfoDiariaDTO } from '../../domains/dtos/InfoDiariaDTO';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { MatSelectModule } from '@angular/material/select';
import { AgendamentoService } from '../../services/agendamento.service';
import { DateUtils } from '../../utils/DateUtils';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { HorasEnum } from '../../domains/enums/HorasEnum';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { ProfissionalService } from '../../services/profissional.service';

@Component({
  selector: 'app-diaria-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    PipeModule,
    MatSelectModule,
    AutoCompleteComponent,
    MatExpansionModule
  ],
  templateUrl: './diaria-admin.component.html',
  styleUrls: ['./diaria-admin.component.scss']
})
export class DiariaAdminComponent implements OnInit {

  @Input('profissionais')
  public profissionais: Array<ProfissionalDTO> = [];

  @Input('clientes')
  public clientes: ClienteDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly VALORES_HORAS: { id: HorasEnum, valor: number, descricao: string, numProfissionais: number }[] = AgendamentoConstantes.VALORES_HORAS;

  public indice: number = 0;
  public clienteSelecionado: string | null = "";
  public dataSource = new MatTableDataSource<InfoDiariaDTO>();
  public dataDiaria: MomentInput;
  public exibeDados: boolean = false;

  public displayedColumns: string[] = [];

  constructor(
    private _notificacaoService: NotificacaoService,
    private _agendamentoService: AgendamentoService,
    private _profissionalService: ProfissionalService,
    private _changes: ChangeDetectorRef,
    private _clienteService: ClienteService) {
    this.displayedColumns = [
      'nome', 'telefone',
      'endereco', 'localizacao',
      'valor', 'desconto',
      'turno', 'tipoLimpeza', 'horas'
    ];
  }

  ngOnInit(): void {
    if (this.profissionais.length == 0) {
      this.recuperarProfissionais()
    }

    if (this.clientes.length == 0) {
      this.recuperarClientes();
    }
  }

  public recuperarProfissionais() {
    this._profissionalService.get()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = prof;
      });
  }

  public limpar() {
    this.dataDiaria = null;
    this.clienteSelecionado = null;
  }

  public buscarDiarias() {
    this.exibeDados = true;
    const email = this.clienteSelecionado ? this.clienteSelecionado.replaceAll(" ", "") : "";
    this._agendamentoService.buscarInfoDiarias(DateUtils.format(this.dataDiaria, DateUtils.ES), email)
      .subscribe(
        (diarias: Array<InfoDiariaDTO>) => {
          this.recuperarDiaria(diarias);
        }, (error: any) => {
          this.exibeDados = false;
          this._notificacaoService.erro(error);
        });
  }

  public recuperarClientes() {
    this._clienteService.recuperarTodos()
      .subscribe((cliente: Array<ClienteDTO>) => {
        this.clientes = cliente;
      });
  }

  public recuperarDiaria(diarias: InfoDiariaDTO[]) {
    this.dataSource = new MatTableDataSource<InfoDiariaDTO>(diarias);
    this.dataSource.paginator = this.paginator;
  }

  public salvarAtualizacoes(diaria: InfoDiariaDTO) {
    this._agendamentoService.atualizarInfoDiaria(diaria)
      .subscribe((diaria: InfoDiariaDTO) => {
        this._notificacaoService.alerta(MensagemEnum.DIARIA_ATUALIZADA_SUCESSO);
        this._changes.detectChanges();
      }, (error: any) => {
        this._notificacaoService.erro(error);
      });

  }
}
