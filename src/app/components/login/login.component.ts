import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Rota } from '../../app.routes';
import { UsuarioService } from '../../services/usuario.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { UsuarioDTO } from '../../domains/dtos/UsuarioDTO';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formLogin!: FormGroup;
  public readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/;
  public bg: string = "fullbg";
  public showBooleanSenha: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _authService: AutenticacaoService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.logar();
    }
  }

  public isXs() {
    if (typeof window !== 'undefined') {
      const documentWidth = window.document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public home() {
    this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
  }

  public logar() {
    if (this.formLogin.controls['senha'].invalid) {
      this._notificacaoService.erro("Senha inválida.");
      return;
    }

    if (this.formLogin.invalid) {
      this._notificacaoService.erro("Formulario invalido.");
      return;
    }

    const email = this.formLogin.controls['email'].value;
    const senha = this.formLogin.controls['senha'].value;
    this._authService.login(email, senha)
      .subscribe(
        (usuario: UsuarioDTO) => {
          if (usuario.autenticado) {
            this._authService.autenticar(usuario.email);
            this._router.navigate([Rota.HOME], { queryParams: { tab: 3 } });
          } else {
            this._notificacaoService.alerta(MensagemEnum.USUARIO_NAO_AUTENTICADO);
            this._usuarioService.confirmarEmail(usuario.email)
              .subscribe(result => { });
          }
        },
        (error) => {
          this._notificacaoService.erro(error);
        });
  }

  public cadastrar() {
    this._router.navigate([Rota.CADASTRO]);
  }

  public recuperarSenha() {
    this._router.navigate([Rota.RECUPERACAO_SENHA]);
  }
  
}