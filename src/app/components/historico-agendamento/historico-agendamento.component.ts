import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../../pipes/pipe.module';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { MatIconModule } from '@angular/material/icon';
import { HistoricoAgendamentoDTO } from '../../domains/dtos/HistoricoAgendamentoDTO';
import { MatButtonModule } from '@angular/material/button';
import { AgendamentoService } from '../../services/agendamento.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { RegistroAgendamentoDTO } from '../../domains/dtos/RegistroAgendamentoDTO';
import { DateUtils } from '../../utils/DateUtils';
import { CalendarioAgendamentoComponent } from '../calendario-agendamento/calendario-agendamento.component';
import { TipoClienteEnum } from '../../domains/enums/TipoClienteEnum';
import { TituloComponent } from '../titulo/titulo.component';

@Component({
  selector: 'app-historico-agendamento',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PipeModule,
    CalendarioAgendamentoComponent,
    TituloComponent
  ],
  templateUrl: './historico-agendamento.component.html',
  styleUrls: ['./historico-agendamento.component.scss']
})
export class HistoricoAgendamentoComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly data: any = inject<HistoricoAgendamentoDTO[]>(MAT_DIALOG_DATA);
  public agendamentos: HistoricoAgendamentoDTO[] = this.data['data'];
  public nomeProfissional: string = this.data['nomeProfissional'];
  public tipoCliente: number = this.data['tipoCliente'];
  public email: string = this.data['email'];

  public indice: number = 0;
  public dataSource = new MatTableDataSource<HistoricoAgendamentoDTO>(this.agendamentos);
  public agendamentoSelecionado: HistoricoAgendamentoDTO | null = this.getAgendamentoSelecionado();

  public displayedColumns: string[] = ['endereco', 'tipoLimpeza', 'turno', 'metragem',
    'valor', 'desconto', 'dataHora'];

  constructor(private _agendamentoService: AgendamentoService,
    private _notificacaoService: NotificacaoService,
    private _dialogRef: MatDialogRef<HistoricoAgendamentoComponent>) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public isXs() {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public anterior() {
    this.indice--;
    this.agendamentoSelecionado = this.getAgendamentoSelecionado(this.indice);
  }

  public proximo() {
    this.indice++;
    this.agendamentoSelecionado = this.getAgendamentoSelecionado(this.indice);
  }

  private getAgendamentoSelecionado(indice: number = this.indice) {
    if (this.indice < 0) {
      indice = 0;
    } else if (indice > this.agendamentos.length - 1) {
      indice = this.agendamentos.length - 1;
    }

    this.indice = indice;
    return this.agendamentos.length > 0 ? this.agendamentos[indice] : new HistoricoAgendamentoDTO();
  }

  public mostrarBotaoSaida(): boolean {
    let agora = new Date();
    if (DateUtils.isBefore(agora, this.agendamentoSelecionado?.dataHora, 'yyyy-MM-dd') && !this.agendamentoSelecionado?.horaSaida && this.agendamentoSelecionado?.situacao == 1) {
      if (this.agendamentoSelecionado.turno == 1 && agora.getHours() > 10) {
        return true;
      } else if (this.agendamentoSelecionado.turno == 2 && agora.getHours() > 16) {
        return true;
      }
    }
    return false;
  }

  public fechar() {
    this._dialogRef.close();
  }

  public mostrarBotaoChegada(): boolean {
    let agora = new Date();
    if (DateUtils.isBefore(agora, this.agendamentoSelecionado?.dataHora, 'yyyy-MM-dd') && !this.agendamentoSelecionado?.horaEntrada && this.agendamentoSelecionado?.situacao == 1) {
      if (this.agendamentoSelecionado.turno == 1 && agora.getHours() >= 8 && agora.getHours() <= 10) {
        return true;
      } else if (this.agendamentoSelecionado.turno == 2 && agora.getHours() >= 13 && agora.getHours() <= 16) {
        return true;
      }
    }
    return false;
  }

  public isCliente() {
    return this.tipoCliente == TipoClienteEnum.CLIENTE;
  }

  public isDiarista() {
    return this.tipoCliente == TipoClienteEnum.DIARISTA;
  }

  public isAdmin() {
    return this.tipoCliente == TipoClienteEnum.ADMIN;
  }

  public marcarHorarioAtendimento(entrada: boolean) {
    if (this.agendamentoSelecionado) {
      let registro = new RegistroAgendamentoDTO();
      registro.horario = new Date();
      registro.idCliente = this.agendamentoSelecionado.idCliente;
      registro.dataDiaria = this.agendamentoSelecionado.dataHora;

      this._agendamentoService.registrarHorarioAtendimento(registro)
        .subscribe((result: any) => {
          this._notificacaoService.alerta(entrada ? "Entrada Registrada!" : "Saída Registrada!");
        }, (error: any) => {
          this._notificacaoService.erro("Falha ao consultar os agendamentos. Tente novamente mais tarde!");
        });
    }
  }
}
