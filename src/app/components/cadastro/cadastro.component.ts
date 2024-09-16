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

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  public formLogin!: FormGroup;
  public readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/;
  public bg: string = "fullbg";

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _authService: AutenticacaoService,
    private _usuarioService: UsuarioService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]],
      senhaVal: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]]
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
      this._notificacaoService.erro("Formulario invalido.");
      return;
    }

    if (this.formLogin.controls['senha'].value != this.formLogin.controls['senhaVal'].value) {
      this._notificacaoService.erro("As Senhas informadas são diferentes.");
      return;
    }

    let usuario = new UsuarioDTO();
    usuario.email = this.formLogin.controls['email'].value;
    usuario.senha = this.formLogin.controls['senha'].value;
    this._usuarioService.cadastrar(usuario)
      .subscribe(
        (usuario: UsuarioDTO) => {
          this._authService.autenticar(usuario.email);
          this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
        },
        (error) => {
          LocalStorageUtils.removeCacheAutenticacao();
          this._notificacaoService.erro(error);
        });
  }

  public isXs() {
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }
}