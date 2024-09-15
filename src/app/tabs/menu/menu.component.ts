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
import { ClienteService } from '../../services/cliente.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { HistoricoAgendamentoComponent } from '../../components/historico-agendamento/historico-agendamento.component';
import { HistoricoAgendamentoDTO } from '../../domains/dtos/HistoricoAgendamentoDTO';
import { NotificacaoService } from '../../services/notificacao.service';

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
  public menus: MenuDTO[] = [
    { label: "Home", id: "idMenuHome", index: 1 },
    { label: "Serviços", id: "idMenuServico", index: 2 },
    { label: "Agendamentos", id: "idMenuAgend", index: 3 },
    { label: "Planos", id: "idMenuPlano", index: 4 },
  ];
  public selectedMenu: MenuDTO = this.menus[0];
  public selectedIndex: number = 1;

  public cliente: ClienteDTO | null = null;

  constructor(private dialog: MatDialog,
    public authService: AutenticacaoService,
    private _agendamentoService: AgendamentoService,
    private _notificacaoService: NotificacaoService,
    private _clienteService: ClienteService,
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
  }

  ngAfterContentChecked(): void {
    this.updateSelectedMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.authService.isLoggedIn()) {
      this.logout();
    }
  }

  login(): void {
    this._router.navigate([Rota.LOGIN]);
  }

  public contratar() {
    const email: string | undefined = this.authService.validarUsuario(false);
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
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
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
        this.abrirPagina(HistoricoAgendamentoComponent, agendamentos, email);
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
    this.authService.validarUsuario(true);
  }

  public abrirPagina(component: ComponentType<any>, data: any, email: string) {
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
          data: data
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