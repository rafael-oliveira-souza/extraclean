import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Rota } from '../../app.routes';
import { UsuarioDTO } from '../../domains/dtos/UsuarioDTO';
import { MensagemEnum } from '../../domains/enums/MensagemEnum';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { UsuarioService } from '../../services/usuario.service';
import { CalculoUtils } from '../../utils/CalculoUtils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-senha-esquecida',
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
  templateUrl: './senha-esquecida.component.html',
  styleUrls: ['./senha-esquecida.component.scss']
})
export class SenhaEsquecidaComponent implements OnInit {
  public formLogin!: FormGroup;
  public bg: string = "fullbg";
  public showBooleanSenha: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public isXs() {
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      return CalculoUtils.isXs(documentWidth);
    }

    return false;
  }

  public home() {
    this._router.navigate([Rota.LOGIN]);
  }

  public recuperarSenha() {
    if (this.formLogin.invalid) {
      this._notificacaoService.erro("Email inválido.");
      return;
    }

    const email = this.formLogin.controls['email'].value;
    this._usuarioService.recuperarSenha(email)
      .subscribe(
        (result) => {
          this._notificacaoService.alerta(MensagemEnum.EMAIL_RECUPERACAO_SENHA_ENVIADO);
          this._router.navigate([Rota.LOGIN]);
        },
        (error) => {
          this._notificacaoService.erro(error);
        });
  }

}