import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { TipoServicoEnum } from '../../domains/enums/TipoServicoEnum';
import { NotificacaoService } from '../../services/notificacao.service';
import { PlanoService } from '../../services/plano.service';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { AgendamentoPagamentoInfoDTO } from '../../domains/dtos/AgendamentoPagamentoInfoDTO';
import { AgendamentoService } from '../../services/agendamento.service';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { OrigemPagamentoEnum } from '../../domains/enums/OrigemPagamentoEnum';
import { DateUtils } from '../../utils/DateUtils';
import { TipoPlanoEnum } from '../../domains/enums/TipoPlanoEnum';
import { HorasEnum } from '../../domains/enums/HorasEnum';
import { TurnoEnum } from '../../domains/enums/TurnoEnum';
import { MoedaPipe } from '../../pipes/moeda.pipe';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';

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
    MoedaPipe,
    MatCheckboxModule,
    DialogModule,
    MatButtonModule,
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
})
export class PlanosComponent {

  @Input("agendamento")
  public agendamento: AgendamentoDTO = new AgendamentoDTO();

  @Output()
  public getUrl: EventEmitter<string> = new EventEmitter();

  public static readonly PLANOS: PlanoDTO[] = [
    new PlanoDTO(TipoPlanoEnum.SEMANAL, "Semanal", "Consiste em 2 diárias de 4 ou 8 horas em datas que o cliente definir.", 6, 2, 2),
    new PlanoDTO(TipoPlanoEnum.MENSAL, "Mensal", "Consiste em 4 diárias de 4 ou 8 horas em datas que o cliente definir", 9, 4, 4),
    new PlanoDTO(TipoPlanoEnum.TRIMESTAL, "Trimestal", "Consiste em 12 diárias de 4 ou 8 horas em datas que o cliente definir", 12, 12, 6),
    new PlanoDTO(TipoPlanoEnum.SEMESTRAL, "Semestral", "Consiste em 24 diárias de 4 ou 8 horas em datas que o cliente definir", 15, 24, 6),
    new PlanoDTO(TipoPlanoEnum.ANUAL, "Anual", "Consiste em 48 diárias de 4 ou 8 horas em datas que o cliente definir", 18, 48, 12)
  ];

  public readonly VALORES_HORAS: { id: HorasEnum, valor: number, descricao: string, numProfissionais: number }[] = AgendamentoConstantes.VALORES_HORAS;
  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public planos: Array<PlanoDTO> = [];
  public pagamento: PagamentoDTO = new PagamentoDTO();
  public agendamentoInfo: AgendamentoPagamentoInfoDTO = new AgendamentoPagamentoInfoDTO();
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

    PlanosComponent.PLANOS.forEach(plano => this.planos.push(plano));
  }

  public calcularTotal(plano: PlanoDTO): AgendamentoPagamentoInfoDTO {
    if (!this.pagamento.horas) {
      return new AgendamentoPagamentoInfoDTO();
    }

    if (this.pagamento.metragem < 0) {
      this.pagamento.metragem = 0;
    }

    return AgendamentoConstantes.calcularTotalPorHora(
      this.pagamento.horas, plano.qtdDias, this.pagamento.extraPlus, plano.desconto, TurnoEnum.NAO_DEFINIDO);
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
    this.agendamentoInfo = this.calcularTotal(plano);
  }


  public agendar(plano: PlanoDTO) {
    const email: string | undefined = this.authService.validarUsuario(true, true);
    if (!email) {
      return;
    }

    let dadosAgendamento: AgendamentoDTO = new AgendamentoDTO();
    dadosAgendamento.endereco = this.agendamento.endereco;
    dadosAgendamento.dataHora = new Date();
    dadosAgendamento.desconto = this.agendamentoInfo.desconto;
    dadosAgendamento.valor = this.agendamentoInfo.valor;
    dadosAgendamento.horas = this.agendamentoInfo.horas;
    dadosAgendamento.metragem = this.pagamento.metragem;
    dadosAgendamento.email = this.agendamento.email;
    dadosAgendamento.extraPlus = this.pagamento.extraPlus;
    dadosAgendamento.diasSelecionados = [DateUtils.toDate(this.agendamento.dataHora, 'yyyy-MM-dd')];
    dadosAgendamento.origem = OrigemPagamentoEnum.AGENDAMENTO;
    dadosAgendamento.quantidadeItens = 1;
    dadosAgendamento.profissionais = this.agendamento.profissionais;
    dadosAgendamento.qtdParcelas = plano.qtdParcelas;
    dadosAgendamento.turno = this.agendamento.turno;
    dadosAgendamento.tipoLimpeza = this.pagamento.isDetalhada ? TipoServicoEnum.DETALHADA : TipoServicoEnum.EXPRESSA;
    this._agendamentoService.agendar(dadosAgendamento)
      .subscribe((result: PagamentoMpDTO) => {
        this.urlPagamento = result.url;
        window.open(result['url'], '_blank');
        this.getUrl.emit(result.url);
        this.notification.alerta(MensagemEnum.AGENDAMENTO_CONCLUIDO_SUCESSO);
      }, (error) => this.notification.erro(error));
  }

  public comprar(plano: PlanoDTO) {
    const email: string | undefined = this.authService.validarUsuario(false, true);
    if (!email) {
      return;
    }

    const agendamento: AgendamentoPagamentoInfoDTO = this.calcularTotal(plano);
    plano.dataHora = new Date();
    plano.valor = agendamento.valor;
    plano.horas = agendamento.horas;
    plano.desconto = agendamento.desconto;
    plano.quantidadeItens = 1;
    plano.qtdParcelas = plano.qtdParcelas;
    plano.tipoLimpeza = plano.isDetalhada ? TipoServicoEnum.DETALHADA : TipoServicoEnum.EXPRESSA;
    plano.email = email ? email : "";
    plano.origem = OrigemPagamentoEnum.PLANO;
    plano.extraPlus = plano.extraPlus;
    plano.tipoPlano = plano.id;
    this.planoService.criar(plano)
      .subscribe((pag: PagamentoMpDTO) => {
        this.urlPagamento = pag.url;
        this.getUrl.emit(pag.url);
        this.notification.alerta(MensagemEnum.PLANO_CONCLUIDO_SUCESSO);
        const documentWidth = document.documentElement.clientWidth;
        const documentHeigth = document.documentElement.clientHeight;
        window.open(pag['url'], '_blank');
        // this.dialog.open(PagamentoComponent, {
        //   minWidth: `${documentWidth * 0.8}px`,
        //   maxWidth: `${documentWidth * 0.9}px`,
        //   minHeight: `${documentHeigth * 0.9}px`,
        //   maxHeight: `${documentHeigth * 0.95}px`,
        //   data: {
        //     email: email,
        //     data: { pagamento: this.pagamento, url: pag.url }
        //   }
        // });
      }, (error) => {
        this.notification.erro(error);
      });
  }
}