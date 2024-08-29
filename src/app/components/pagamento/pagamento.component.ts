import { Component, OnInit } from '@angular/core';
import { environment } from '../../../enviromment';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from 'express';
import { NotificacaoService } from '../../services/notificacao.service';
import { UsuarioService } from '../../services/usuario.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  public formCartao!: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _notificacaoService: NotificacaoService) { }

  ngOnInit() {
    this.formCartao = this._formBuilder.group({
      nomeCartao: ['', [Validators.required]],
    });
  }
}
