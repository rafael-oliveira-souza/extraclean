import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PlanoService } from '../../services/plano.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MomentInput } from 'moment';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { ClienteService } from '../../services/cliente.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { PipeModule } from '../../pipes/pipe.module';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { AgendamentoResumoDTO } from '../../domains/dtos/AgendamentoResumoDTO';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { SituacaoPlanoEnum } from '../../domains/enums/SituacaoPlanoEnum';

@Component({
  selector: 'app-plano-admin',
  standalone: true,
  templateUrl: './plano-admin.component.html',
  styleUrls: ['./plano-admin.component.scss'],
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
  ]
})
export class PlanoAdminComponent implements OnInit {
  @Input('clientes')
  public clientes: ClienteDTO[] = [];

  public indice: number = 0;
  public clienteSelecionado: string | null = "";
  public dataSource = new MatTableDataSource<AgendamentoResumoDTO>();
  public dataDiaria: MomentInput;
  public exibeDados: boolean = false;

  public displayedColumns: string[] = [];

  constructor(
    private _notificacaoService: NotificacaoService,
    private _planoService: PlanoService,
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
    if (this.clientes.length == 0) {
      this.recuperarClientes();
    }
  }

  public limpar() {
    this.dataDiaria = null;
    this.clienteSelecionado = null;
    this.dataSource = new MatTableDataSource<AgendamentoResumoDTO>([]);
  }

  public recuperarClientes() {
    this._clienteService.recuperarTodos()
      .subscribe((cliente: Array<ClienteDTO>) => {
        this.clientes = cliente;
      });
  }

  public buscarPlanos() {
    this._planoService.recuperarPorCliente(this.clienteSelecionado)
      .subscribe((planos: Array<AgendamentoResumoDTO>) => {
        this.dataSource = new MatTableDataSource<AgendamentoResumoDTO>(planos);
      });
  }

  public cancelar(agend: AgendamentoResumoDTO) {
    this._planoService.cancelar(agend.planoId)
      .subscribe((result: any) => {
        this._notificacaoService.alerta(MensagemEnum.PLANO_CANCELADO_SUCESSO);
      });
  }

  public podeCancelar(agend: AgendamentoResumoDTO) {
    return agend.situacao &&
      agend.situacao != SituacaoPlanoEnum.CANCELADO &&
      agend.situacao != SituacaoPlanoEnum.FINALIZADO;
  }

  public baixarContrato(agend: AgendamentoResumoDTO) {
    this._planoService.baixarContrato(agend)
      .subscribe((blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${agend.nomeContratante.trim()}_${agend.data}_contratacao_plano.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

}
