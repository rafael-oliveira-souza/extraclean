import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PlanoDTO } from '../../../domains/dtos/PlanoDTO';

@Component({
  selector: 'app-contratacao',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './contratacao.component.html',
  styleUrl: './contratacao.component.scss'
})
export class ContratacaoComponent {
  readonly dialogRef = inject(MatDialogRef<ContratacaoComponent>);
  readonly plano = inject<PlanoDTO>(MAT_DIALOG_DATA);

}
