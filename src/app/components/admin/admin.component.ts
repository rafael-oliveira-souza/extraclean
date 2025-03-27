import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Rota } from '../../app.routes';
import { MenuDTO } from '../../domains/dtos/MenuDTO';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AgendamentoComponent } from '../../tabs/agendamento/agendamento.component';
import { PlanosComponent } from '../../tabs/planos/planos.component';
import { ServicosComponent } from '../../tabs/servicos/servicos.component';
import { ScrollComponent } from '../scroll/scroll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CepComponent } from '../cep/cep.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EnderecoDTO } from '../../domains/dtos/EnderecoDTO';
import { ProfissionalComponent } from '../profissional/profissional.component';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';
import { ProfissionalService } from '../../services/profissional.service';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { EnderecoUtils } from '../../utils/EnderecoUtils';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { TipoClienteEnum } from '../../domains/enums/TipoClienteEnum';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificacaoService } from '../../services/notificacao.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { CalendarioAgendamentoComponent } from '../calendario-agendamento/calendario-agendamento.component';
import { HorasEnum } from '../../domains/enums/HorasEnum';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { HistoricoAdminComponent } from '../historico-admin/historico-admin.component';
import { ProfissionalAdminComponent } from '../profissional-admin/profissional-admin.component';
import { DateUtils } from '../../utils/DateUtils';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { CepService } from '../../services/cep.service';
import { PipeModule } from '../../pipes/pipe.module';
import { MatSelectModule } from '@angular/material/select';
import { AgendarPlanoComponent } from "../agendar-plano/agendar-plano.component";
import { GeradorContrachequeComponent } from '../gerador-contracheque/gerador-contracheque.component';
import { ClienteAdminComponent } from '../cliente-admin/cliente-admin.component';
import { DiariaAdminComponent } from '../diaria-admin/diaria-admin.component';
import { PagamentoProfissionalComponent } from "../pagamento-profissional/pagamento-profissional.component";
import { TipoProfissionalEnum } from '../../domains/enums/TipoProfissionalEnum';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    PagamentoProfissionalComponent,
    PlanosComponent,
    ServicosComponent,
    MatButtonModule,
    MatMenuModule,
    CepComponent,
    CommonModule,
    ScrollComponent,
    PlanosComponent,
    MatButtonToggleModule,
    MatCheckboxModule,
    CalendarioAgendamentoComponent,
    HistoricoAdminComponent,
    ProfissionalAdminComponent,
    AutoCompleteComponent,
    MatSelectModule,
    PipeModule,
    AgendarPlanoComponent,
    ClienteAdminComponent,
    GeradorContrachequeComponent,
    DiariaAdminComponent,
    PagamentoProfissionalComponent
],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public readonly ATTR_SELECTED: string = "selected";
  public width: number | null = null;
  public menus: MenuDTO[] = [
    { label: "Agendar Plano", id: "idEnvioAgendamentoPlano", index: 0 },
    { label: "Enviar Agendamento", id: "idEnvioAgendamento", index: 1 },
    { label: "Criar Cliente", id: "idCriarCliente", index: 2 },
    { label: "Gerenciar Agendamentos", id: "idCalendAgend", index: 3 },
    { label: "Gerenciar Clientes/Profissionais", id: "idGerencProf", index: 4 },
    { label: "Gerar Contra Cheque", id: "idGerencContraCheque", index: 5 },
  ];
  public readonly VALORES_HORAS: { id: HorasEnum, valor: number, descricao: string, numProfissionais: number }[] = AgendamentoConstantes.VALORES_HORAS;

  public selectedMenu: MenuDTO = this.menus[0];
  public selectedIndex: number = 1;
  public endereco: EnderecoDTO = new EnderecoDTO();
  public profissionais: Array<ProfissionalDTO> = [];
  public profissionaisSelecionados: number[] = [0];
  public agendamento: AgendamentoDTO = new AgendamentoDTO();
  public clientes: ClienteDTO[] = [];
  public cliente: ClienteDTO = new ClienteDTO();
  public tipoCliente: TipoClienteEnum = TipoClienteEnum.CLIENTE;
  public desabilitarEndereco: boolean = false;
  public agendamentoManual: boolean = true;
  public showTable: boolean = true;
  public isPlano: boolean = false;
  public editaDados: number = 3;
  public url!: string;

  constructor(
    public authService: AutenticacaoService,
    public clienteService: ClienteService,
    public _cepService: CepService,
    public _agendamentoService: AgendamentoService,
    private _router: Router,
    private _notificacaoService: NotificacaoService,
    private _profissionalService: ProfissionalService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.agendamento.enviarEmail = true;
    this.route.queryParams.subscribe(params => {
      this.selectedIndex = 0;
      const tab = params['tab'];
      if (tab && tab > 0 && tab <= this.menus.length) {
        this.selectedIndex = tab;
      }
    });

    if (!this.authService.isAdminLoggedIn()) {
      this._router.navigate([Rota.LOGIN]);
    }
    this.recuperarClientes();
    this.recuperarProfissionais();
  }

  public recuperarClientes() {
    this.clienteService.recuperarTodos()
      .subscribe((clientes: Array<ClienteDTO>) => {
        this.clientes = clientes;
      });
  }

  public atualizarEndereco() {
    this.recuperarClientes();
    this.agendamento.endereco = "";
    this.endereco = new EnderecoDTO();
    if (this.agendamento.email) {
      this.clienteService.recuperarTodos()
        .subscribe((clientes: Array<ClienteDTO>) => {
          this.clientes = clientes;
          const clientesSelecionados = this.clientes.filter(cli => cli.email.toLowerCase().trim() == this.agendamento.email?.toLowerCase().trim());
          if (clientesSelecionados && clientesSelecionados.length > 0) {
            this.agendamento.endereco = clientesSelecionados[0].endereco;
            this.endereco.valido = true;
          }
        });
    }
  }

  public recuperarProfissional(profissional: ProfissionalDTO[]) {
    this.agendamento.profissionais = this.profissionaisSelecionados;
  }

  public getEndereco(endereco: EnderecoDTO) {
    this.endereco = endereco;
    this.agendamento.endereco = EnderecoUtils.montarEndereco(endereco);
  }

  public isEnderecoValido() {
    return this.endereco.valido || this.agendamento.endereco != undefined || this.agendamento.endereco != null;
  }

  public updateSelectedMenu(): void {
    this.menus.forEach(menu => {
      if (typeof document !== 'undefined') {
        const inputData: HTMLElement | null = document.getElementById(menu.id);
        const selected: boolean = this.selectedIndex == menu.index;
        inputData?.setAttribute(this.ATTR_SELECTED, selected.toString());
      }
    });
  }

  public recuperarProfissionais() {
    this._profissionalService.get()
      .subscribe((prof: Array<ProfissionalDTO>) => {
        this.profissionais = prof;
        this.agendamento.ignoreQtdProfissionais = true;
      });
  }

  public ordenarProfissionais(prof: Array<ProfissionalDTO>) {
    return prof
      .filter(profi => profi.tipo == TipoProfissionalEnum.DIARISTA)
      .sort((a1, a2) => {
        if (a1.nome < a2.nome) return -1;
        if (a1.nome > a2.nome) return 1;
        return 0;
      });
  }

  public select(index: number) {
    if (this.selectedIndex == 0 || this.selectedIndex == 1) {
      this.recuperarProfissionais();
      this.recuperarClientes();
    }

    this.selectedIndex = index;
    this._router.navigate([Rota.ADMIN], { queryParams: { tab: index } });
  }

  public agendar() {
    if (this.agendamento.dataExpiracaoPagamento == null) {
      this.agendamento.dataExpiracaoPagamento = DateUtils.add(this.agendamento.dataHora, 1, 'day').toDate();
    }

    this.agendamento.diasSelecionados = [DateUtils.toDate(this.agendamento.dataHora)];
    this.agendamento.ignoreQtdProfissionais = true;
    this.agendamento.tipoLimpeza = this.agendamento.tipoLimpeza;
    this._agendamentoService.agendar(this.agendamento)
      .subscribe((result: PagamentoMpDTO) => {
        this.url = result.url;
        this.agendamento = new AgendamentoDTO();
        this.agendamento.profissionais = [];
        this._notificacaoService.alerta(MensagemEnum.AGENDAMENTO_CONCLUIDO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error));
  }

  public home() {
    this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
  }

  public criarCliente() {
    this.cliente.tipo = this.tipoCliente;
    this.clienteService.criar(this.cliente)
      .subscribe(cliente => {
        this._notificacaoService.alerta("Cliente Criado com sucesso.");
        this.cliente = new ClienteDTO();
        this._notificacaoService.alerta(MensagemEnum.CLIENTE_CRIADO_CONCLUIDO_SUCESSO);
        this.recuperarProfissionais();
        this.recuperarClientes();
      }, (error) => this._notificacaoService.erro(error));
  }

  public recuperarClienteSelecionado(clientes: ClienteDTO[]) {
    if (clientes.length == 1) {
      const clienteSelec = clientes[0];
      this.agendamento.endereco = clienteSelec.endereco;
      this._cepService.getCep(clienteSelec.cep)
        .subscribe((cepRecuperado: EnderecoDTO) => {
          if (cepRecuperado['erro']) {
            this.endereco = EnderecoUtils.montarEnderecoPorValores(clienteSelec.endereco, clienteSelec.numero, clienteSelec.cep);
          } else {
            this.endereco = cepRecuperado;
            this.endereco.logradouro = clienteSelec.endereco;
            this.endereco.numero = clienteSelec.numero;
            this.endereco.valido = true;
          }
          this.desabilitarEndereco = true;
        });
    } else {
      this.agendamento.endereco = "";
      this.endereco = new EnderecoDTO();
      this.desabilitarEndereco = false;
    }
  }
}


