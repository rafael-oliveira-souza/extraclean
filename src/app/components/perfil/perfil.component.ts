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
  public cliente: ClienteDTO | null = null;
  public readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/;
  readonly data: any = inject<any>(MAT_DIALOG_DATA);

  constructor(private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<PerfilComponent>) {
    this.cliente = this.data['cliente'];
    this.formLogin = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]],
      senhaVal: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]]
    });
  }

  ngOnInit(): void {
  }

  public alterarSenha() {

  }
}
