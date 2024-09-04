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
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TurnoEnum } from '../../domains/enums/TurnoEnum';
import { Router } from '@angular/router';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { Rota } from '../../app.routes';
import { PagamentoComponent } from '../../components/pagamento/pagamento.component';
import { PagamentoDTO } from '../../domains/dtos/PagamentoDTO';
import { TipoLimpezaEnum } from '../../domains/enums/TipoLimpezaEnum';
import { TipoPlanoEnum } from '../../domains/enums/TipoPlanoEnum';
import { NotificacaoService } from '../../services/notificacao.service';
import { PlanoService } from '../../services/plano.service';
import { PagamentoMpDTO } from '../../domains/dtos/PagamentoMpDto';
// import { PagamentoComponent } from '../../components/pagamento/pagamento.component';

@Component({
  selector: 'app-planos',
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
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanosComponent {
  public readonly VALOR_DESLOCAMENTO = AgendamentoConstantes.VALOR_DESLOCAMENTO;
  public readonly VALOR_PROFISSIONAL_SELECIONADO = AgendamentoConstantes.VALOR_PROFISSIONAL_SELECIONADO;
  public planos: Array<PlanoDTO> = [];
  public pagamento: PagamentoDTO = new PagamentoDTO();

  constructor(private planoService: PlanoService, private notification: NotificacaoService, private _router: Router, private dialog: MatDialog) {
    // this.planos.push(new PlanoDTO("Diário", "Plano Meu lar", 99));
    this.planos.push(new PlanoDTO(1, "Semanal", "Consiste em 2 diárias expressas em datas que o cliente definir.", 1.9, 2));
    this.planos.push(new PlanoDTO(2, "Mensal", "Consiste em 4 diárias expressas em datas que o cliente definir", 1.8, 4));
    this.planos.push(new PlanoDTO(3, "Trimestal", "Consiste em 12 diárias expressas em datas que o cliente definir", 1.7, 12));
    this.planos.push(new PlanoDTO(4, "Semestral", "Consiste em 24 diárias expressas em datas que o cliente definir", 1.6, 24));
    this.planos.push(new PlanoDTO(5, "Anual", "Consiste em 48 diárias expressas em datas que o cliente definir", 1.5, 48));
  }

  public calcularTotal(plano: PlanoDTO) {
    const porcentagem = 0;
    if (!this.pagamento.metragem) {
      return 0;
    }

    return AgendamentoConstantes.calcularTotal(
      plano.valorMetro, this.pagamento.metragem, plano.qtdDias,
      porcentagem, this.pagamento.extraPlus, false,
      TurnoEnum.NAO_DEFINIDO);
  }

  public calcularDesconto(plano: PlanoDTO) {
    const porcentagem = 0;
    if (!this.pagamento.metragem) {
      return 0;
    }

    const valorComDesconto = this.calcularTotal(plano);
    const valorOriginal = AgendamentoConstantes.calcularTotal(
      AgendamentoConstantes.VALOR_PADRAO_METRO, this.pagamento.metragem, plano.qtdDias,
      porcentagem, this.pagamento.extraPlus, false,
      TurnoEnum.NAO_DEFINIDO);

    return valorOriginal - valorComDesconto;
  }

  public calcularDiaria(plano: PlanoDTO) {
    if (!this.pagamento.metragem) {
      return 0;
    }

    const valorComDesconto = this.calcularTotal(plano);
    return valorComDesconto / plano.qtdDias;
  }

  public comprar(plano: PlanoDTO) {
    if (!this.isUserNaoLogado()) {
      // this._router.navigate([Rota.LOGIN]);
    } else {
      const email = LocalStorageUtils.getUsuario();
      this.pagamento.valor = this.calcularTotal(plano);
      this.pagamento.desconto = this.calcularDesconto(plano);
      this.pagamento.quantidadeItens = 1;
      this.pagamento.qtdParcelas = 1;
      this.pagamento.tipoLimpeza = TipoLimpezaEnum.EXPRESSA;
      this.pagamento.email = email ? email : "";
      // this._router.navigate([Rota.PAGAMENTO]);

      this.planos.forEach(plano => {
        if (this.pagamento.tipoPlano = plano.id) {
          this.planoService.criar(plano)
            .subscribe((pag: PagamentoMpDTO) => {
              const documentWidth = document.documentElement.clientWidth;
              const documentHeight = document.documentElement.clientHeight;
              let dialogRef = this.dialog.open(PagamentoComponent, {
                minWidth: `${documentWidth * 0.6}px`,
                maxWidth: `${documentWidth * 0.8}px`,
                minHeight: `70vh`,
                maxHeight: `90vh`,
                data: { pagamento: this.pagamento, url: pag.url }
              });
            }, (error) => {
              this.notification.erro(error);
            });
        }
      });
    }
  }

  private isUserNaoLogado(): boolean {
    const userMail: string | null = LocalStorageUtils.getUsuario();
    return !userMail;
  }

}