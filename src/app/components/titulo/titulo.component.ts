import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-titulo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule, MatIconModule,],
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent {
  @Input('titulo')
  public titulo!: string;

  constructor(private _dialogRef: MatDialogRef<any>) { }

  public fechar() {
    this._dialogRef.close();
  }


}
