import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MomentInput } from 'moment';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { AgendamentoPagamentoInfoDTO } from '../../domains/dtos/AgendamentoPagamentoInfoDTO';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { PagamentoDTO } from '../../domains/dtos/PagamentoDTO';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { HorasEnum } from '../../domains/enums/HorasEnum';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { OrigemPagamentoEnum } from '../../domains/enums/OrigemPagamentoEnum';
import { TipoPlanoEnum } from '../../domains/enums/TipoPlanoEnum';
import { TipoServicoEnum } from '../../domains/enums/TipoServicoEnum';
import { TurnoEnum } from '../../domains/enums/TurnoEnum';
import { HorasDiariaPipe } from '../../pipes/horasDiaria.pipe';
import { MoedaPipe } from '../../pipes/moeda.pipe';
import { TurnoPipe } from '../../pipes/turno.pipe';
import { AgendamentoService } from '../../services/agendamento.service';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ClienteService } from '../../services/cliente.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { PlanoService } from '../../services/plano.service';
import { ProfissionalService } from '../../services/profissional.service';
import { PlanosComponent } from '../../tabs/planos/planos.component';
import { DateUtils } from '../../utils/DateUtils';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { ProfissionalComponent } from '../profissional/profissional.component';
import { TaxaCartaoPipe } from '../../pipes/taxa-cartao.pipe';
import { PontoPipe } from '../../pipes/ponto.pipe';
import { MatSelectModule } from '@angular/material/select';
import { FormaPagamentoEnum } from '../../domains/enums/FormaPagamentoEnum';
import { TipoPagamentoEnum } from '../../domains/enums/TipoPagamentoEnum';

@Component({
  selector: 'app-agendar-plano',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MoedaPipe,
    TaxaCartaoPipe,
    PontoPipe,
    MatCheckboxModule,
    DialogModule,
    MatButtonModule,
    AutoCompleteComponent,
    ProfissionalComponent,
  ],
  templateUrl: './agendar-plano.component.html',
  styleUrls: ['./agendar-plano.component.scss']
})
export class AgendarPlanoComponent implements OnInit {
  @Input("agendamento")
  public agendamento: AgendamentoDTO = new AgendamentoDTO();
  @Input("clientes")
  public clientes: ClienteDTO[] = [];
  @Input("profissionais")
  public profissionais: ProfissionalDTO[] = [];

  @Output()
  public getUrl: EventEmitter<string> = new EventEmitter();

  public static readonly PLANOS: PlanoDTO[] = [
    new PlanoDTO(TipoPlanoEnum.DIARIA_2, "2 Diárias", "Consiste em 2 diárias de 4 ou 8 horas em datas que o cliente definir.", 3, 2, 2),
    new PlanoDTO(TipoPlanoEnum.DIARIA_4, "4 Diárias", "Consiste em 4 diárias de 4 ou 8 horas em datas que o cliente definir", 7, 4, 3),
    new PlanoDTO(TipoPlanoEnum.DIARIA_6, "6 Diárias", "Consiste em 6 diárias de 4 ou 8 horas em datas que o cliente definir", 11, 6, 3),
    new PlanoDTO(TipoPlanoEnum.DIARIA_8, "8 Diárias", "Consiste em 8 diárias de 4 ou 8 horas em datas que o cliente definir", 15, 8, 4),
    new PlanoDTO(TipoPlanoEnum.DIARIA_10, "10 Diárias", "Consiste em 10 diárias de 4 ou 8 horas em datas que o cliente definir", 20, 10, 4)
  ];

  public readonly VALORES_HORAS: { id: HorasEnum, valor: number, descricao: string, numProfissionais: number }[] = AgendamentoConstantes.VALORES_HORAS;
  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public readonly dataMin = new Date();
  public readonly dataMax: Date = DateUtils.toMoment().add(1, 'year').toDate();

  public planos: Array<PlanoDTO> = [];
  public tipoPlano!: TipoPlanoEnum;
  public agendamentoInfo: AgendamentoPagamentoInfoDTO = new AgendamentoPagamentoInfoDTO();
  public planoSelecionado: PlanoDTO | null = null;
  public urlPagamento: string | null = null;
  public extraPlus: boolean = false;
  public qtdDias: number[] = [];
  public formaPagamento!: number;
  public qtdParcelas: number = 1;
  public profissionaisSelecionados: Array<number> = [];
  public turno: TurnoEnum = TurnoEnum.INTEGRAL;
  public emailAgendamento: string = "";
  public agendamentos: Array<AgendamentoDTO> = [];
  public cliente!: ClienteDTO;

  constructor(private planoService: PlanoService,
    private authService: AutenticacaoService,
    private notification: NotificacaoService,
    private _agendamentoService: AgendamentoService,
    private _profissionalService: ProfissionalService,
    private dialog: MatDialog) {
    PlanosComponent.PLANOS.forEach(plano => this.planos.push(plano));
  }

  ngOnInit(): void {
  }

  recuperarClienteSelecionado(clientes: any[]) {
    if (clientes && clientes.length == 1) {
      this.cliente = clientes[0];
      this.agendamentos.forEach(agend => {
        agend.email = this.cliente.email;
        agend.endereco = this.cliente.endereco;
      })
    }
  }

  public calcularTotal(plano: PlanoDTO): AgendamentoPagamentoInfoDTO {
    let totais = new AgendamentoPagamentoInfoDTO();

    this.agendamentos.forEach(agend => {
      if (agend.metragem < 0) {
        agend.metragem = 0;
      }

      agend.valor = Number(agend.valor);
      agend.origem = OrigemPagamentoEnum.PLANO;
      agend.formaPagamento = this.formaPagamento == 1 ? FormaPagamentoEnum.PIX : FormaPagamentoEnum.CARTAO;
      agend.tipoPagamento = this.formaPagamento == 1 ? TipoPagamentoEnum.DINHEIRO : TipoPagamentoEnum.CREDITO;
      agend.qtdParcelas = this.qtdParcelas;
      agend.quantidadeItens = 1;
      agend.tipoPlano = this.planoSelecionado ? this.planoSelecionado.tipoPlano : TipoPlanoEnum.DIARIA;

      if (agend.valor > 0) {
        let valorComDesconto = agend.valor;
        if (this.extraPlus) {
          valorComDesconto = agend.valor + this.VALOR_PROFISSIONAL_SELECIONADO;
        }

        let desconto = AgendamentoConstantes.aplicarDesconto(valorComDesconto, plano.desconto);
        totais.desconto += desconto;
        totais.valor += valorComDesconto;
      }
    });

    if (this.formaPagamento == 2) {
      let porcentCartao = this.calcularTaxaCartao(totais.valor);
      totais.total = totais.valor - totais.desconto + porcentCartao;
    } else {
      totais.total = totais.valor - totais.desconto;
    }
    return totais;
  }

  public atualizarAgendamentos() {
    this.qtdDias = [];
    this.agendamentos = [];
    for (let i = 0; i < this.recuperarQtdDiasPorPlano(); i++) {
      this.qtdDias.push(i + 1);
      let agendamento = new AgendamentoDTO();
      agendamento.dataHora = new Date();
      agendamento.ignoreQtdProfissionais = true;
      agendamento.endereco = this.cliente?.endereco;
      agendamento.email = this.emailAgendamento;
      agendamento.valor = 0;
      agendamento.desconto = 0;
      this.agendamentos.push(agendamento);
    }
  }

  public recuperarQtdDiasPorPlano() {
    if (this.planoSelecionado) {
      return this.planoSelecionado.qtdDias;
    }

    return 0;
  }

  public selecionarPlano() {
    this.planos.forEach(plano => {
      if (this.tipoPlano == plano.id) {
        this.planoSelecionado = plano;
        this.planoSelecionado.tipoPlano = this.tipoPlano;
        this.atualizarAgendamentos();
        return;
      }
    });
  }

  public atualizarValores(plano: PlanoDTO) {
    this.agendamentoInfo = this.calcularTotal(plano);
  }


  public comprar(plano: PlanoDTO) {
    if (!this.planoSelecionado) {
      return;
    }

    this.planoService.agendar(this.planoSelecionado.tipoPlano, this.agendamentos)
      .subscribe((pag: PagamentoMpDTO) => {
        this.urlPagamento = pag.url;
        this.getUrl.emit(pag.url);
        this.notification.alerta(MensagemEnum.PLANO_CONCLUIDO_SUCESSO);
        this.agendamentos = [];
        this.tipoPlano = 0;
        window.open(pag['url'], '_blank');
      }, (error) => {
        this.notification.erro(error);
      });
  }

  public calcularTaxaCartao(valor: number) {
    const taxaCartaoPipe = new TaxaCartaoPipe();
    return valor * taxaCartaoPipe.transform(this.qtdParcelas) / 100;
  }

  public recuperarProfissionais() {
    this._profissionalService.get()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = prof;
      });
  }
}
