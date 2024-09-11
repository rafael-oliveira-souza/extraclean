import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { MatInputModule } from '@angular/material/input';
import { NotificacaoService } from '../../services/notificacao.service';
import { UsuarioService } from '../../services/usuario.service';
import { ClienteService } from '../../services/cliente.service';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { UsuarioDTO } from '../../domains/dtos/UsuarioDTO';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule, MatIconModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  public formLogin!: FormGroup;
  public formCliente!: FormGroup;
  public cliente: ClienteDTO = new ClienteDTO();
  public exibePerfil: boolean = true;
  public readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/;
  readonly data: any = inject<any>(MAT_DIALOG_DATA);

  constructor(private _formBuilder: FormBuilder,
    private _notificacaoService: NotificacaoService,
    private _usuarioService: UsuarioService,
    private _clienteService: ClienteService,
    private _authService: AutenticacaoService,
    private _dialogRef: MatDialogRef<PerfilComponent>) {
    this.cliente = this.data['cliente'];
    this.formCliente = this._formBuilder.group({
      nome: [this.cliente.nome, [Validators.required]],
      sobrenome: [this.cliente.sobrenome, [Validators.required]],
      telefone: [this.cliente.telefone, [Validators.required]],
      endereco: [this.cliente.endereco, [Validators.required]],
      numero: [this.cliente.numero, [Validators.required]],
      cep: [this.cliente.cep, [Validators.required]],
      localizacao: [this.cliente.localizacao, []],
    });
    this.formLogin = this._formBuilder.group({
      senhaAntiga: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]],
      senhaVal: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]]
    });
  }

  ngOnInit(): void {
  }

  public alterarSenha() {
    this.exibePerfil = false;
  }

  public atualizar() {
    this.cliente.nome = this.formCliente.controls['nome'].value;
    this.cliente.sobrenome = this.formCliente.controls['sobrenome'].value;
    this.cliente.endereco = this.formCliente.controls['endereco'].value;
    this.cliente.numero = this.formCliente.controls['numero'].value;
    this.cliente.cep = this.formCliente.controls['cep'].value;
    this.cliente.localizacao = this.formCliente.controls['localizacao'].value;
    this._clienteService.salvar(this.cliente)
      .subscribe(
        (cliente: ClienteDTO) => {
          LocalStorageUtils.setItem(LocalStorageUtils.USUARIO_CACHE_CLIENTE, cliente);
          this.cliente = cliente;
          this.exibePerfil = true;
          this._notificacaoService.alerta("Cliente atualizado com sucesso.");
        },
        (error: any) => {
          this.exibePerfil = false;
          this._notificacaoService.erro(error);
        });
  }

  public salvarSenha() {
    if (this.formLogin.invalid) {
      this._notificacaoService.erro("Senha inválida.");
      return;
    }

    if (this.formLogin.controls['senha'].value != this.formLogin.controls['senhaVal'].value) {
      this._notificacaoService.erro("As Senhas informadas são diferentes.");
      return;
    }

    let usuario = new UsuarioDTO();
    usuario.email = this.cliente.email;
    usuario.senha = this.formLogin.controls['senha'].value;
    usuario.senhaAntiga = this.formLogin.controls['senhaAntiga'].value;
    this._usuarioService.atualizarSenha(usuario)
      .subscribe(
        (usuario: UsuarioDTO) => { 
          this.exibePerfil = true;
          this._notificacaoService.alerta("Senha atualizada com sucesso.");
          this.formLogin.reset();
        },
        (error: any) => {
          this.exibePerfil = false;
          this._notificacaoService.erro(error);
        });
  }
}
