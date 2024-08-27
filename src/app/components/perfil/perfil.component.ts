import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDTO } from '../../domains/dtos/ClienteDTO';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import {
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  public readonly USUARIO_CACHE_CLIENTE: string = "XXXX_USUARIO_CACHE_CLIENTE_XXXX";

  public cliente: ClienteDTO | null = null;

  constructor(private _clienteService: ClienteService,
    private _dialogRef: MatDialogRef<PerfilComponent>) { }

  ngOnInit(): void {
    const userMail: string | null = LocalStorageUtils.getUsuario();
    if (!userMail) {
      // this.dialogRef.close(true);
    }

    this.cliente = LocalStorageUtils.getItem(this.USUARIO_CACHE_CLIENTE);
    if (!this.cliente) {
      this._clienteService.recuperarCliente(userMail)
        .subscribe((cliente: ClienteDTO) => {
          LocalStorageUtils.setItem(this.USUARIO_CACHE_CLIENTE, cliente);
          this.cliente = cliente;
        });
    }
  }

}
