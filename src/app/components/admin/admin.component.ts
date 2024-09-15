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

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
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
    PlanosComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public readonly ATTR_SELECTED: string = "selected";
  public width: number | null = null;
  public formCep!: FormGroup;
  public menus: MenuDTO[] = [
    { label: "Calcular", id: "idCalculoAgendamento", index: 1 },
    { label: "Enviar Agendamento", id: "idEnvioAgendamento", index: 2 },
  ];
  public selectedMenu: MenuDTO = this.menus[0];
  public selectedIndex: number = 1;

  constructor(
    private _formBuilder: FormBuilder,
    public authService: AutenticacaoService,
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

    if (!this.authService.isAdminLoggedIn()) {
      this._router.navigate([Rota.LOGIN]);
    }
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
    this._router.navigate([Rota.ADMIN], { queryParams: { tab: index } });
  }


  public home() {
    this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
  }

  public montarFormCep(habilitaInput: boolean) {
    this.formCep = this._formBuilder.group({
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      numero: ['', Validators.required],
      logradouro: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      complemento: new FormControl({ value: '', disabled: false }),
      bairro: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      localidade: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      uf: new FormControl({ value: '', disabled: habilitaInput }, Validators.required),
      naoEncontrado: false
    });

    this.formCep.controls['naoEncontrado'].valueChanges.subscribe(val => {
      if (val) {
        this.formCep.controls['logradouro'].setValue("");
        this.formCep.controls['localidade'].setValue("");
        this.formCep.controls['bairro'].setValue("");
        this.formCep.controls['uf'].setValue("");
        this.formCep.controls['numero'].setValue("");
        this.formCep.controls['logradouro'].enable();
        this.formCep.controls['localidade'].enable();
        this.formCep.controls['bairro'].enable();
        this.formCep.controls['uf'].enable();
      } else {
        this.formCep.controls['logradouro'].disable();
        this.formCep.controls['localidade'].disable();
        this.formCep.controls['bairro'].disable();
        this.formCep.controls['uf'].disable();
      }
    });
  }
}


