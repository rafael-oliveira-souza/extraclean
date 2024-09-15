import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { PlanoService } from '../../services/plano.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  styleUrl: './pagamento.component.scss'
})
export class PagamentoComponent {
  readonly dialogRef = inject(MatDialogRef<PagamentoComponent>);
  readonly data: any = inject<any>(MAT_DIALOG_DATA);

  public linkPagamento  : SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.linkPagamento = this.sanitizer.bypassSecurityTrustResourceUrl(this.data['url']);
  }
}
