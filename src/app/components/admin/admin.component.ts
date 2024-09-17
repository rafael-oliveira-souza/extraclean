import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Rota } from '../../app.routes';
import { MenuDTO } from '../../domains/dtos/MenuDTO';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { AgendamentoComponent } from '../../tabs/agendamento/agendamento.component';
import { HomeComponent } from '../../tabs/home/home.component';
import { PlanosComponent } from '../../tabs/planos/planos.component';
import { ServicosComponent } from '../../tabs/servicos/servicos.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { ScrollComponent } from '../scroll/scroll.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    AgendamentoComponent,
    PlanosComponent,
    ServicosComponent,
    MatButtonModule,
    MatMenuModule,
    CepComponent,
    CommonModule,
    ScrollComponent,
    PlanosComponent,
    ProfissionalComponent,
    MatButtonToggleModule,
    MatCheckboxModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public readonly ATTR_SELECTED: string = "selected";
  public width: number | null = null;
  public menus: MenuDTO[] = [
    { label: "Enviar Agendamento", id: "idEnvioAgendamento", index: 1 },
    { label: "Criar Cliente", id: "idCriarCliente", index: 2 },
  ];

  public selectedMenu: MenuDTO = this.menus[0];
  public selectedIndex: number = 1;
  public endereco: EnderecoDTO = new EnderecoDTO();
  public profissionais: Array<ProfissionalDTO> = [];
  public profissionaisSelecionados: number[] = [0];
  public agendamento: AgendamentoDTO = new AgendamentoDTO();
  public cliente: ClienteDTO = new ClienteDTO();
  public tipoCliente: TipoClienteEnum = TipoClienteEnum.CLIENTE;
  public url!: string;

  constructor(
    public authService: AutenticacaoService,
    public clienteService: ClienteService,
    public _agendamentoService: AgendamentoService,
    private _router: Router,
    private _notificacaoService: NotificacaoService,
    private _profissionalService: ProfissionalService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedIndex = 1;
      const tab = params['tab'];
      if (tab && tab > 0 && tab <= this.menus.length) {
        this.selectedIndex = tab;
      }
    });

    if (!this.authService.isAdminLoggedIn()) {
      this._router.navigate([Rota.LOGIN]);
    }

    this.recuperarProfissionais();
  }

  public recuperarProfissional(profissional: ProfissionalDTO) {
    this.agendamento.profissionais = this.profissionaisSelecionados;
  }

  public getEndereco(endereco: EnderecoDTO) {
    this.endereco = endereco;
    this.agendamento.endereco = EnderecoUtils.montarEndereco(endereco);
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

  public select(index: number) {
    this.selectedIndex = index;
    this._router.navigate([Rota.ADMIN], { queryParams: { tab: index } });
  }

  public agendar() {
    this.agendamento.diasSelecionados = [this.agendamento.dataHora];
    this.agendamento.dataHora = new Date();
    this.agendamento.ignoreQtdProfissionais = true;
    this._agendamentoService.agendar(this.agendamento)
      .subscribe((result: PagamentoMpDTO) => {
        this.url = result.url;
        this.agendamento = new AgendamentoDTO();
        this._notificacaoService.alerta(MensagemEnum.AGENDAMENTO_CONCLUIDO_SUCESSO);
      }, (error) => this._notificacaoService.erro(error.error));
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
      });
  }
}


