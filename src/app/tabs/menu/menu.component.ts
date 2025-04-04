import { ChangeDetectorRef, Component, inject, SimpleChanges } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AgendamentoComponent } from "../agendamento/agendamento.component";
import { PlanosComponent } from '../planos/planos.component';
import { ServicosComponent } from '../servicos/servicos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from '../home/home.component';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { CommonModule } from '@angular/common';
import { MenuDTO } from '../../domains/dtos/MenuDTO';
import { ScrollComponent } from '../../components/scroll/scroll.component';
import { PerfilComponent } from '../../components/perfil/perfil.component';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { Rota } from '../../app.routes';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { AgendamentoService } from '../../services/agendamento.service';
import { HistoricoAgendamentoComponent } from '../../components/historico-agendamento/historico-agendamento.component';
import { HistoricoAgendamentoDTO } from '../../domains/dtos/HistoricoAgendamentoDTO';
import { NotificacaoService } from '../../services/notificacao.service';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { AutenticacaoDTO } from '../../domains/dtos/AutenticacaoDTO';
import { TipoClienteEnum } from '../../domains/enums/TipoClienteEnum';
import { InfoAgendamentoDTO } from '../../domains/dtos/InfoAgendamentoDTO';
import { HistoricoProfissionalComponent } from '../../components/historico-profissional/historico-profissional.component';
import { DateUtils } from '../../utils/DateUtils';
import { PontoProfissionalComponent } from '../../components/ponto-profissional/ponto-profissional.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    AgendamentoComponent,
    PlanosComponent,
    ServicosComponent,
    MatButtonModule,
    MatMenuModule,
    HomeComponent,
    CommonModule,
    ScrollComponent,
    PerfilComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  public readonly ATTR_SELECTED: string = "selected";

  public width: number | null = null;
  public selectedIndex: number = 1;
  public cliente: ClienteDTO | null = null;
  public menus: MenuDTO[] = [
    { label: "Home", id: "idMenuHome", index: 1 },
    { label: "Serviços", id: "idMenuServico", index: 2 },
    { label: "Agendamentos", id: "idMenuAgend", index: 3 },
    { label: "Planos", id: "idMenuPlano", index: 4 },
  ];

  public menusHamb: any[] = [];
  public selectedMenu: MenuDTO = this.menus[0];

  constructor(private dialog: MatDialog,
    public authService: AutenticacaoService,
    private _agendamentoService: AgendamentoService,
    private _notificacaoService: NotificacaoService,
    private _router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedIndex = 1;
      const tab = params['tab'];
      if (tab && tab > 0 && tab <= this.menus.length) {
        this.selectedIndex = tab;
      }
    });
    this.exibirMenus();
  }

  ngAfterContentChecked(): void {
    this.updateSelectedMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.authService.isLoggedIn()) {
      this.logout();
    }
  }

  public exibirMenus() {
    if (this.authService.isLoggedIn()) {
      this.menusHamb = [];
      const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
      if (auth != null) {
        if (auth.tipoUsuario == TipoClienteEnum.ADMIN || auth.tipoUsuario == TipoClienteEnum.GERENTE) {
          this.menusHamb.push({ label: "Administração", icon: "admin_panel_settings", method: () => this.abrirAdministrador() });
        } else if (auth.tipoUsuario == TipoClienteEnum.DIARISTA) {
          this.menusHamb.push({ label: "Historico de Limpezas", icon: "admin_panel_settings", method: () => this.abrirHistoricoLimpeza() });
          this.menusHamb.push({ label: "Agendamentos da Semana", icon: "event_note", method: () => this.abrirHistoricoAgendamento() });
          this.menusHamb.push({ label: "Registro de Ponto", icon: "schedule", method: () => this.abrirRegistroPonto() });
        } else if (auth.tipoUsuario == TipoClienteEnum.CLIENTE) {
          this.menusHamb.push({ label: "Meus Agendamentos", icon: "event_note", method: () => this.abrirHistoricoAgendamento() });
        }
      }

      this.menusHamb.push({ label: "Meu Perfil", icon: "account_circle", method: () => this.abrirPerfil() });
      this.menusHamb.push({ label: "Sair", icon: "logout", method: () => this.logout() });
    } else {
      this.menusHamb = [
        { label: "Entrar", icon: "login", method: () => this.login() },
      ];
    }
  }

  login(): void {
    this._router.navigate([Rota.LOGIN]);
  }

  public contratar() {
    this.exibirMenus();
    const email: string | undefined = this.authService.validarUsuario(false, true);
    if (!email) {
      return;
    }

    this._router.navigate([Rota.HOME], { queryParams: { tab: 3 } });
    return;
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

  public select(index: number) {
    this.selectedIndex = index;
    this._router.navigate([Rota.HOME], { queryParams: { tab: index } });
  }

  public isXs() {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public definirLabel(menu: MenuDTO) {
    return (menu.index == 3 && this.isXs() ? 'Agende!' : menu.label);
  }

  public abrirHistoricoAgendamento() {
    const email: string | null = this.authService.getUsuarioAutenticado();
    if (email == null) {
      this._router.navigate([Rota.LOGIN]);
      return;
    }

    const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
    if (auth == null || auth.tipoUsuario == TipoClienteEnum.CLIENTE) {
      this._agendamentoService.recuperarHistorico(email)
        .subscribe((agendamentos: HistoricoAgendamentoDTO[]) => {
          this.abrirPagina(HistoricoAgendamentoComponent, agendamentos, email, null, TipoClienteEnum.CLIENTE);
        }, (error: any) => {
          this._notificacaoService.erro("Falha ao consultar os agendamentos. Tente novamente mais tarde!");
        });
    } else {
      if (auth.tipoUsuario == TipoClienteEnum.DIARISTA) {
        this.abrirPagina(HistoricoAgendamentoComponent, [], auth.username, auth.nome, auth.tipoUsuario);
      } else {
        this.abrirPagina(HistoricoAgendamentoComponent, [], auth.username, "", auth.tipoUsuario);
      }
    }
  }

  public abrirAdministrador() {
    if (this.authService.isAdminLoggedIn()) {
      this._router.navigate([Rota.ADMIN]);
    }
  }
  public abrirRegistroPonto() {
    if (this.authService.isLoggedIn()) {
      const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
      if (auth == null) {
        return;
      }
      this.abrirPagina(PontoProfissionalComponent, [], auth.username, auth.nome, auth.tipoUsuario);

    } else {
      this._router.navigate([Rota.LOGIN]);
    }
  }

  public abrirHistoricoLimpeza() {
    if (this.authService.isLoggedIn()) {
      const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
      if (auth == null) {
        return;
      }
      this.abrirPagina(HistoricoProfissionalComponent, [], auth.username, auth.nome, auth.tipoUsuario);

    } else {
      this._router.navigate([Rota.LOGIN]);
    }
  }

  public abrirPerfil() {
    this.authService.validarUsuario(true, true);
  }

  public abrirPagina(component: ComponentType<any>, data: any, email: string,
    nomeProfissional: string | null, tipoCliente: number) {
    let dialogRef;
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      const documentHeigth = document.documentElement.clientHeight;
      dialogRef = this.dialog.open(component, {
        minWidth: `${documentWidth * 0.9}px`,
        maxWidth: `${documentWidth * 1}px`,
        minHeight: `${documentHeigth * 0.9}px`,
        maxHeight: `${documentHeigth * 0.95}px`,
        data: {
          email: email,
          data: data,
          nomeProfissional: nomeProfissional,
          tipoCliente: tipoCliente
        }
      });
    } else {
      dialogRef = this.dialog.open(component, {
        minWidth: `90%`,
        maxWidth: `100%`,
        minHeight: '90%',
        maxHeight: '100%',
        data: {
          email: email,
          data: data
        }
      });

    }

    dialogRef.afterClosed().subscribe(logout => {
      if (logout) {
        this.logout();
      }
    });
  }

  public logout() {
    this.authService.logout();
  }
}