import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PlanoDTO } from '../../domains/dtos/PlanoDTO';
import { PlanoService } from '../../services/plano.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { AgendamentoDTO } from '../../domains/dtos/AgendamentoDTO';
import { AgendamentoInfoDTO } from '../../domains/dtos/AgendamentoInfoDTO';
import { PagamentoDTO } from '../../domains/dtos/PagamentoDTO';
import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PipeModule } from '../../pipes/pipe.module';
import { ItensLimpezaComponent } from '../itens-limpeza/itens-limpeza.component';
import { ProfissionalDTO } from '../../domains/dtos/ProfissionalDTO';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    PipeModule,
    MatCheckboxModule,
    DialogModule,
    MatButtonModule,
    ItensLimpezaComponent,
  ],
  styleUrl: './pagamento.component.scss'
})
export class PagamentoComponent implements OnInit {

  public linkPagamento!: SafeResourceUrl;

  @Input('agendamento')
  public agendamento: AgendamentoDTO = new AgendamentoDTO();

  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // window.open(this.data['url'], '_blank');
    // open(this.data['url']);
    // this.linkPagamento = this.sanitizer.bypassSecurityTrustResourceUrl(this.data['url']);
  }

  public isExtraPlus() {
    return !ProfissionalDTO.isEmpty(this.agendamento.profissionais[0]);
  }
}
