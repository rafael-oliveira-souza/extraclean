import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../domains/dtos/UsuarioDTO';
import { NotificacaoService } from '../../services/notificacao.service';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { Rota } from '../../app.routes';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  public formLogin!: FormGroup;
  public readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/;
  public bg: string = "fullbg";
  public showBooleanSenha: boolean = false;
  public showBooleanReSenha: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _authService: AutenticacaoService,
    private _usuarioService: UsuarioService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      senhaVal: ['', [Validators.required]]
    });
  }

  public logar() {
    this._router.navigate([Rota.LOGIN]);
  }

  public home() {
    this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
  }

  public cadastrar() {
    if (this.formLogin.invalid) {
      this._notificacaoService.alerta("Por favor, preencha todos os campos!");
      return;
    }

    if (this.formLogin.controls['senha'].value != this.formLogin.controls['senhaVal'].value) {
      return;
    }

    let usuario = new UsuarioDTO();
    usuario.email = this.formLogin.controls['email'].value;
    usuario.senha = this.formLogin.controls['senha'].value;
    this._usuarioService.cadastrar(usuario)
      .subscribe(
        (usuario: UsuarioDTO) => {
          this._router.navigate([Rota.LOGIN]);
          this._notificacaoService.alerta(MensagemEnum.USUARIO_CRIADO_COM_SUCESSO);
        },
        (error) => {
          LocalStorageUtils.removeCacheAutenticacao();
          this._notificacaoService.erro(error);
        });
  }

  public isXs() {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }
}