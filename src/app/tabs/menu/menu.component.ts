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
      this.menusHamb = [
        { label: "Meu Perfil", icon: "account_circle", method: () => this.abrirPerfil() },
        { label: "Meus Agendamentos", icon: "event_note", method: () => this.abrirHistoricoAgendamento() },
        { label: "Administração", icon: "admin_panel_settings", method: () => this.abrirAdministrador() },
        { label: "Sair", icon: "logout", method: () => this.logout() },
      ];
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

    this._agendamentoService.recuperarHistorico(email)
      .subscribe((agendamentos: HistoricoAgendamentoDTO[]) => {
        LocalStorageUtils.getAuth()

        let cliente: any = LocalStorageUtils.getCliente();
        this.abrirPagina(HistoricoAgendamentoComponent, agendamentos, email, cliente['nome']);
      }, (error: any) => {
        this._notificacaoService.erro("Falha ao consultar os agendamentos. Tente novamente mais tarde!");
      });
  }

  public abrirAdministrador() {
    if (this.authService.isAdminLoggedIn()) {
      this._router.navigate([Rota.ADMIN]);
    }
  }

  public abrirPerfil() {
    this.authService.validarUsuario(true, true);
  }

  public abrirPagina(component: ComponentType<any>, data: any, email: string, nomeProfissional: string | null) {
    let dialogRef;
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      const documentHeigth = document.documentElement.clientHeight;
      dialogRef = this.dialog.open(component, {
        minWidth: `${documentWidth * 0.8}px`,
        maxWidth: `${documentWidth * 0.9}px`,
        minHeight: `${documentHeigth * 0.9}px`,
        maxHeight: `${documentHeigth * 0.95}px`,
        data: {
          email: email,
          data: data,
          nomeProfissional: nomeProfissional
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