import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../pipes/pipe.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ContratacaoComponent } from './contratacao/contratacao.component';
import { DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    PipeModule,
    MatCheckboxModule,
    DialogModule
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanosComponent {

  public planos: Array<PlanoDTO> = [];
  public planoPlus: boolean = false;
  readonly dialog = inject(MatDialog);

  constructor() {
    this.planos.push(new PlanoDTO("Diário", "Plano Meu lar", 99));
    this.planos.push(new PlanoDTO("Semanal", "", 99));
    this.planos.push(new PlanoDTO("Mensal", "", 99));
    this.planos.push(new PlanoDTO("Anual", "", 99));
  }

  public abrirContratacao(plano: PlanoDTO) {
    const documentWidth = document.documentElement.clientWidth;
    const documentHeight = document.documentElement.clientHeight;
    let dialogRef = this.dialog.open(ContratacaoComponent, {
      minWidth: `${documentWidth * 0.4}px`,
      maxWidth: `${documentWidth * 0.8}px`,
      minHeight: `${documentHeight * 0.2}px`,
      maxHeight: `${documentHeight * 0.8}px`,
      data: plano
    });
  }
}
