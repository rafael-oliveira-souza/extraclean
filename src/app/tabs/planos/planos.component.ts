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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentInput } from 'moment';
import { HorasDTO } from '../../domains/dtos/HorasDTO';
import { AutoCompleteComponent } from '../../components/auto-complete/auto-complete.component';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { HorasDiariaPipe } from '../../pipes/horasDiaria.pipe';
import { TurnoPipe } from '../../pipes/turno.pipe';
import { ProfissionalComponent } from '../../components/profissional/profissional.component';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { ProfissionalService } from '../../services/profissional.service';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MoedaPipe,
    MatCheckboxModule,
    DialogModule,
    MatButtonModule,
    AutoCompleteComponent,
    ProfissionalComponent,
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
    new PlanoDTO(TipoPlanoEnum.DIARIA_2, "2 Diárias", "Consiste em 2 diárias de 4 ou 8 horas em datas que o cliente definir.", 4, 2, 2),
    new PlanoDTO(TipoPlanoEnum.DIARIA_4, "4 Diárias", "Consiste em 4 diárias de 4 ou 8 horas em datas que o cliente definir", 8, 4, 3),
    new PlanoDTO(TipoPlanoEnum.DIARIA_6, "6 Diárias", "Consiste em 6 diárias de 4 ou 8 horas em datas que o cliente definir", 12, 6, 3),
    new PlanoDTO(TipoPlanoEnum.DIARIA_8, "8 Diárias", "Consiste em 8 diárias de 4 ou 8 horas em datas que o cliente definir", 16, 8, 4),
    new PlanoDTO(TipoPlanoEnum.DIARIA_10, "10 Diárias", "Consiste em 10 diárias de 4 ou 8 horas em datas que o cliente definir", 20, 10, 4)
  ];

  public readonly VALORES_HORAS: { id: HorasEnum, valor: number, descricao: string, numProfissionais: number }[] = AgendamentoConstantes.VALORES_HORAS;
  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public readonly dataMin = new Date();
  public readonly dataMax: Date = DateUtils.toMoment().add(1, 'year').toDate();

  public planos: Array<PlanoDTO> = [];
  public pagamento: PagamentoDTO = new PagamentoDTO();
  public agendamentoInfo: AgendamentoPagamentoInfoDTO = new AgendamentoPagamentoInfoDTO();
  public planoSelecionado: PlanoDTO | null = null;
  public urlPagamento: string | null = null;
  public isAdmin: boolean = false;
  public diasSelecionados: MomentInput[] = [];
  public qtdDias: number[] = [];
  public clientes: Array<ClienteDTO> = [];
  public profissionais:Array<ProfissionalDTO> = [];
  public profissionaisSelecionados:Array<number> = [];
  public turno: TurnoEnum = TurnoEnum.INTEGRAL;

  constructor(private planoService: PlanoService,
    private authService: AutenticacaoService,
    private notification: NotificacaoService,
    private _agendamentoService: AgendamentoService,
    private _profissionalService: ProfissionalService,
    private clienteService: ClienteService,
    private dialog: MatDialog) {

    if (this.authService.isAdminLoggedIn()) {
      this.isAdmin = true;
      this.recuperarClientes();
      this.planos.push(new PlanoDTO(0, "Diária", "Consiste em 1 diária expressa ou detalhada em data que o cliente definir.", 0, 1, 1));
    }

    PlanosComponent.PLANOS.forEach(plano => this.planos.push(plano));
  }

  public recuperarClientes() {
    this.clienteService.recuperarTodos()
      .subscribe((clientes: Array<ClienteDTO>) => {
        this.clientes = clientes;
      });
  }

  public calcularTotal(plano: PlanoDTO): AgendamentoPagamentoInfoDTO {
    if (!this.pagamento.horas) {
      return new AgendamentoPagamentoInfoDTO();
    }

    if (this.pagamento.metragem < 0) {
      this.pagamento.metragem = 0;
    }

    this.qtdDias = [];
    for (let i = 0; i < this.recuperarQtdDiasPorPlano(); i++) {
      this.qtdDias.push(i + 1);
    }

    return AgendamentoConstantes.calcularTotalPorHora(
      this.pagamento.horas, plano.qtdDias, this.pagamento.extraPlus, plano.desconto, TurnoEnum.NAO_DEFINIDO);
  }

  public recuperarQtdDiasPorPlano() {
    if (this.planoSelecionado) {
      return this.planoSelecionado.qtdDias;
    }

    return 0;
  }

  public selecionarPlano() {
    this.planos.forEach(plano => {
      if (this.pagamento.tipoPlano == plano.id) {
        this.planoSelecionado = plano;
        this.diasSelecionados = [];
        this.atualizarValores(plano);
        return;
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
    dadosAgendamento.email = this.pagamento.email;
    dadosAgendamento.extraPlus = this.pagamento.extraPlus;
    dadosAgendamento.ignoreQtdProfissionais = true;
    dadosAgendamento.diasSelecionados = this.diasSelecionados;
    dadosAgendamento.origem = OrigemPagamentoEnum.AGENDAMENTO;
    dadosAgendamento.quantidadeItens = 1;
    dadosAgendamento.profissionais = this.agendamento.profissionais;
    dadosAgendamento.qtdParcelas = plano.qtdParcelas;
    dadosAgendamento.turno = this.turno;
    dadosAgendamento.tipoLimpeza = this.pagamento.tipoLimpeza;
    dadosAgendamento.profissionais = this.profissionaisSelecionados;
    this._agendamentoService.agendar(dadosAgendamento)
      .subscribe((result: PagamentoMpDTO) => {
        this.urlPagamento = result.url;
        window.open(result['url'], '_blank');
        this.getUrl.emit(result.url);
        this.notification.alerta(MensagemEnum.AGENDAMENTO_CONCLUIDO_SUCESSO);
      }, (error) => this.notification.erro(error));
  }

  public solicitarPlano(plano: PlanoDTO) {
    window.open(`https://api.whatsapp.com/send?phone=5561998657077&text=Ol%C3%A1,%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es! \n\n Infos:${this.montarInfo()}`, '_blank');
  }

  private montarInfo(): string {
    let infos: string = "";
    const moedaPipe = new MoedaPipe();
    infos = infos.concat(`Email: ${this.pagamento.email} \n\n`);
    infos = infos.concat(`Horas: ${new HorasDiariaPipe().transform(this.pagamento.horas)} \n\n`);
    if (this.planoSelecionado) {
      if (this.diasSelecionados.length > 0) {
        infos = infos.concat(`Dias Selecionados: `);
        this.diasSelecionados.forEach(data => {
          infos = infos.concat(`[${DateUtils.format(data, 'DD/MM/YYYY')}] `);
        });
      }

      infos = infos.concat(`\n\n Turno: ${new TurnoPipe().transform(this.agendamentoInfo.turno)} \n\n`);
      infos = infos.concat(`Valor Total: ${moedaPipe.transform(this.agendamentoInfo.total)} \n\n`);
      infos = infos.concat(`Valor Diária: ${moedaPipe.transform(this.agendamentoInfo.valor)} \n\n`);
      infos = infos.concat(`Valor Desconto : ${moedaPipe.transform(this.agendamentoInfo.desconto)} \n\n`);
      infos = infos.concat(`Valor por Diária: ${moedaPipe.transform(this.agendamentoInfo.total / this.planoSelecionado.qtdDias)} \n\n`);
      infos = infos.concat(`Valor Total Extra Plus: ${moedaPipe.transform(this.VALOR_PROFISSIONAL_SELECIONADO * this.planoSelecionado.qtdDias)} \n`);
    }

    return infos;
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
    plano.diasSelecionados = this.diasSelecionados;
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
  public recuperarProfissionais() {
    this._profissionalService.get()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = prof;
      });
  }
  
  public recuperarProfissional(profissional: ProfissionalDTO) {
    this.agendamento.profissionais = this.profissionaisSelecionados;
  }
}