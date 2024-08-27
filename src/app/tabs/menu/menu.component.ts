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
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { ActivatedRoute, Router } from '@angular/router';
import { Rota } from '../../app.routes';

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
    { label: "Home", id: "idMenuHome", selected: true },
    { label: "Serviços", id: "idMenuServico", selected: false },
    { label: "Agendamentos", id: "idMenuAgend", selected: false },
    { label: "Planos", id: "idMenuPlano", selected: false },
  ];
  public selectedMenu: MenuDTO = this.menus[0];

  constructor(private dialog: MatDialog, private _router: Router) { }

  ngAfterContentChecked(): void {
    this.updateSelectedMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isUserNaoLogado()) {
      this.logout();
    }
  }

  private isUserNaoLogado(): boolean {
    const userMail: string | null = LocalStorageUtils.getUsuario();
    return !userMail;
  }

  public contratar() {
    this._router.navigate([Rota.LOGIN])
  }

  public updateSelectedMenu(): void {
    this.menus.forEach(menu => {
      if (typeof document !== 'undefined') {
        const inputData: HTMLElement | null = document.getElementById(menu.id);
        inputData?.setAttribute(this.ATTR_SELECTED, menu.selected.toString());
      }
    });
  }

  public select(menuDto: MenuDTO) {
    this.selectedMenu = menuDto;
    this.menus.forEach(menu => {
      menu.selected = menu.id == menuDto.id;
    });

    this.updateSelectedMenu();
  }

  public isXs() {
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public abrirPaginaMenu(componentName: string) {
    let component: ComponentType<any> = PerfilComponent;
    if (typeof document !== 'undefined') {
      if (componentName == 'perfil') {
        component = PerfilComponent;
      }

      const documentWidth = document.documentElement.clientWidth;
      const documentHeight = document.documentElement.clientHeight;
      let dialogRef = this.dialog.open(component, {
        minWidth: `${documentWidth * 0.8}px`,
        maxWidth: `${documentWidth * 0.9}px`,
        minHeight: `${documentHeight * 0.8}px`,
        maxHeight: `${documentHeight * 0.8}px`,
      });

      dialogRef.afterClosed().subscribe(logout => {
        if (logout) {
          this.logout();
        }
      })
    }
  }

  public logout() {
    LocalStorageUtils.clear();
  }
}
