import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../pipes/pipe.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PagamentoComponent } from '../../components/pagamento/pagamento.component';
import { PagamentoDTO } from '../../domains/dtos/PagamentoDTO';
import { TipoLimpezaEnum } from '../../domains/enums/TipoLimpezaEnum';
import { NotificacaoService } from '../../services/notificacao.service';
import { PlanoService } from '../../services/plano.service';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { AgendamentoInfoDTO } from '../../domains/dtos/AgendamentoInfoDTO';
import { AgendamentoService } from '../../services/agendamento.service';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { OrigemPagamentoEnum } from '../../domains/enums/OrigemPagamentoEnum';
import { DateUtils } from '../../utils/DateUtils';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    PipeModule,
    MatCheckboxModule,
    DialogModule,
    MatButtonModule,
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanosComponent {

  @Input("agendamento")
  public agendamento: AgendamentoDTO = new AgendamentoDTO();

  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public planos: Array<PlanoDTO> = [];
  public pagamento: PagamentoDTO = new PagamentoDTO();
  public agendamentoInfo: AgendamentoInfoDTO = new AgendamentoInfoDTO();
  public planoSelecionado: PlanoDTO | null = null;
  public urlPagamento: string | null = null;
  public isAdmin: boolean = false;

  constructor(private planoService: PlanoService,
    private authService: AutenticacaoService,
    private notification: NotificacaoService,
    private _agendamentoService: AgendamentoService,
    private dialog: MatDialog) {

    if (this.authService.isAdminLoggedIn()) {
      this.isAdmin = true;
      this.planos.push(new PlanoDTO(0, "Diária", "Consiste em 1 diária expressa ou detalhada em data que o cliente definir.", 0, 1, 1));
    }

    this.planos.push(new PlanoDTO(1, "Semanal", "Consiste em 2 diárias expressas ou detalhadas em datas que o cliente definir.", 5, 2, 2));
    this.planos.push(new PlanoDTO(2, "Mensal", "Consiste em 4 diárias expressas ou detalhadas em datas que o cliente definir", 10, 4, 4));
    this.planos.push(new PlanoDTO(3, "Trimestal", "Consiste em 12 diárias expressas ou detalhadas em datas que o cliente definir", 15, 12, 6));
    this.planos.push(new PlanoDTO(4, "Semestral", "Consiste em 24 diárias expressas ou detalhadas em datas que o cliente definir", 20, 24, 6));
    this.planos.push(new PlanoDTO(5, "Anual", "Consiste em 48 diárias expressas ou detalhadas em datas que o cliente definir", 25, 48, 12));
  }

  public calcularTotal(plano: PlanoDTO): AgendamentoInfoDTO {
    if (!this.pagamento.metragem) {
      return new AgendamentoInfoDTO();
    }

    if (this.pagamento.metragem < 0) {
      this.pagamento.metragem = 0;
    }

    return AgendamentoConstantes.calcularTotal(
      this.pagamento.metragem, this.pagamento.isDetalhada, plano.qtdDias, plano.desconto, this.pagamento.extraPlus);
  }

  public selecionarPlano() {
    this.planos.forEach(plano => {
      if (this.pagamento.tipoPlano == plano.id) {
        this.planoSelecionado = plano;
        this.atualizarValores(plano);
      }
    });
  }

  public atualizarValores(plano: PlanoDTO) {
    if (!this.pagamento.metragem) {
      this.agendamentoInfo = new AgendamentoInfoDTO();
      return;
    }

    this.agendamentoInfo = this.calcularTotal(plano);
  }


  public agendar(plano: PlanoDTO) {
    const email: string | undefined = this.authService.validarUsuario();
    if (!email) {
      return;
    }

    let dadosAgendamento: AgendamentoDTO = new AgendamentoDTO();
    dadosAgendamento.endereco = this.agendamento.endereco;
    dadosAgendamento.dataHora = new Date();
    dadosAgendamento.desconto = this.agendamentoInfo.desconto;
    dadosAgendamento.valor = this.agendamentoInfo.valor;
    dadosAgendamento.metragem = this.pagamento.metragem;
    dadosAgendamento.email = this.agendamento.email;
    dadosAgendamento.extraPlus = this.pagamento.extraPlus;
    dadosAgendamento.diasSelecionados = [DateUtils.toDate(this.agendamento.dataHora)];
    dadosAgendamento.origem = OrigemPagamentoEnum.AGENDAMENTO;
    dadosAgendamento.quantidadeItens = 1;
    dadosAgendamento.profissionais = this.agendamento.profissionais;
    dadosAgendamento.isDetalhada = this.pagamento.isDetalhada;
    dadosAgendamento.qtdParcelas = plano.qtdParcelas;
    dadosAgendamento.turno = this.agendamento.turno;
    dadosAgendamento.tipoLimpeza = this.pagamento.isDetalhada ? TipoLimpezaEnum.DETALHADA : TipoLimpezaEnum.EXPRESSA;
    this._agendamentoService.agendar(dadosAgendamento)
      .subscribe((result: PagamentoMpDTO) => {
        this.urlPagamento = result.url;
        this.notification.alerta("Agendamento realizado com sucesso. O seu agendamento será efetivado após o pagamento!");
      }, (error) => this.notification.erro(error));
  }

  public comprar(plano: PlanoDTO) {
    const email: string | undefined = this.authService.validarUsuario();
    if (!email) {
      return;
    }

    const agendamento: AgendamentoInfoDTO = this.calcularTotal(plano);
    this.pagamento.dataHora = new Date();
    this.pagamento.valor = agendamento.valor;
    this.pagamento.desconto = agendamento.desconto;
    this.pagamento.quantidadeItens = 1;
    this.pagamento.qtdParcelas = plano.qtdParcelas;
    this.pagamento.tipoLimpeza = this.pagamento.isDetalhada ? TipoLimpezaEnum.DETALHADA : TipoLimpezaEnum.EXPRESSA;
    this.pagamento.email = email ? email : "";
    this.pagamento.origem = OrigemPagamentoEnum.PLANO;
    this.pagamento.extraPlus = this.pagamento.extraPlus;
    this.planoService.criar(plano)
      .subscribe((pag: PagamentoMpDTO) => {
        this.urlPagamento = pag.url;
        this.notification.alerta("Plano solicitado com sucesso. O seu plano será efetivado após o pagamento!");
        const documentWidth = document.documentElement.clientWidth;
        const documentHeigth = document.documentElement.clientHeight;
        this.dialog.open(PagamentoComponent, {
          minWidth: `${documentWidth * 0.8}px`,
          maxWidth: `${documentWidth * 0.9}px`,
          minHeight: `${documentHeigth * 0.9}px`,
          maxHeight: `${documentHeigth * 0.95}px`,
          data: {
            email: email,
            data: { pagamento: this.pagamento, url: pag.url }
          }
        });
      }, (error) => {
        this.notification.erro(error);
      });
  }
}