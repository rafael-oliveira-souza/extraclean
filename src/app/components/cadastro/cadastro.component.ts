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

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  public logar() {
    if (this.formLogin.invalid) {
      this._notificacaoService.erro("Formulario invalido.");
    }

    let usuario = new UsuarioDTO();
    usuario.email = this.formLogin.controls['email'].value;
    usuario.senha = this.formLogin.controls['senha'].value;
    this._usuarioService.cadastrar(usuario)
      .subscribe(
        (usuario: UsuarioDTO) => {
          LocalStorageUtils.setUsuario(usuario.email);
          this._router.navigate([Rota.HOME], { queryParams: { tab: 1 } });
        },
        (error) => {
          this._notificacaoService.erro(error);
        });
  }

}
