import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';

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

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]]
    });
  }

  public logar() {
    if (this.formLogin.invalid) {
      this._notificacaoService.erro("Formulario invalido.");
    }

    const email = this.formLogin.controls['email'].value;
    const senha = this.formLogin.controls['senha'].value;
    this._usuarioService.login(email, senha)
      .subscribe(
        (usuario: UsuarioDTO) => {
          LocalStorageUtils.setUsuario(email);
          this._router.navigate([Rota.HOME], { queryParams: { tab: 3 } });
        },
        (error) => {
          this._notificacaoService.erro(error);
        });
  }

}
