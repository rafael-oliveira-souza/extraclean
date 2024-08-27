import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../domains/dtos/UsuarioDTO';
import { NotificacaoService } from '../../services/notificacao.service';

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

    const email = this.formLogin.controls['email'].value;
    const senha = this.formLogin.controls['senha'].value;
    this._usuarioService.login(email, senha)
      .subscribe(
        (usuario: UsuarioDTO) => {

        },
        (error) => {
          this._notificacaoService.erro(error);
        });
  }

}
