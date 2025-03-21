import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PipeModule } from '../../pipes/pipe.module';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { NotificacaoService } from '../../services/notificacao.service';
import { ClienteService } from '../../services/cliente.service';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';

@Component({
  selector: 'app-cliente-admin',
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
    AutoCompleteComponent,
  ],
  templateUrl: './cliente-admin.component.html',
  styleUrls: ['./cliente-admin.component.scss']
})
export class ClienteAdminComponent implements OnInit {

  @Input('clientes')
  public clientes: ClienteDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public indice: number = 0;
  public clienteSelecionado: string = "";
  public dataSource = new MatTableDataSource<ClienteDTO>();

  public displayedColumns: string[] = [];

  constructor(
    private _notificacaoService: NotificacaoService,
    private _clienteService: ClienteService) {
    // 'dataNascimento',
    this.displayedColumns = [
      'nome', 'sobrenome', 'email', 'telefone',
      'endereco', 'numero', 'localizacao', 'cep',
    ];
  }

  ngOnInit(): void {
    if (this.clientes.length == 0) {
      this.recuperarClientes();
    }
  }

  public recuperarClientes() {
    this._clienteService.recuperarTodos()
      .subscribe((cliente: Array<ClienteDTO>) => {
        this.clientes = cliente;
        this.recuperarCliente()
      });
  }

  public recuperarCliente() {
    if (this.clienteSelecionado ) {
      const clientes = this.clientes.filter(cliente => cliente.email == this.clienteSelecionado);
      this.dataSource = new MatTableDataSource<ClienteDTO>(clientes);
    } else {
      this.dataSource = new MatTableDataSource<ClienteDTO>(this.clientes);
    }

    this.dataSource.paginator = this.paginator;
  }

  public salvarAtualizacoesClientes() {
    const clientes: ClienteDTO[] = this.dataSource.data;
    this._clienteService.salvarTodos(clientes)
      .subscribe((cliente: Array<ClienteDTO>) => {
        this._notificacaoService.alerta(MensagemEnum.PROFISSIONAIS_ATUALIZADOS_SUCESSO);
      });

  }

}
