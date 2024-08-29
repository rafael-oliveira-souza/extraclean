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
  public planoPlus: boolean = false;
  public metragem!: number;
  public profissionalSelecionado: boolean = false;
  public planoSelecionado!: string;

  constructor(private _router: Router, private dialog: MatDialog) {
    // this.planos.push(new PlanoDTO("Diário", "Plano Meu lar", 99));
    this.planos.push(new PlanoDTO("Semanal", "Consiste em 2 diárias expressas em datas que o cliente definir.", 1.9, 2));
    this.planos.push(new PlanoDTO("Mensal", "Consiste em 4 diárias expressas em datas que o cliente definir", 1.8, 4));
    this.planos.push(new PlanoDTO("Trimestal", "Consiste em 12 diárias expressas em datas que o cliente definir", 1.7, 12));
    this.planos.push(new PlanoDTO("Semestral", "Consiste em 24 diárias expressas em datas que o cliente definir", 1.6, 24));
    this.planos.push(new PlanoDTO("Anual", "Consiste em 48 diárias expressas em datas que o cliente definir", 1.5, 48));
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

  public calcularTotal(plano: PlanoDTO) {
    const porcentagem = 0;
    if (!this.metragem) {
      return 0;
    }

    return AgendamentoConstantes.calcularTotal(
      plano.valorMetro, this.metragem, plano.qtdDias,
      porcentagem, this.profissionalSelecionado, false,
      TurnoEnum.NAO_DEFINIDO);
  }

  public calcularDesconto(plano: PlanoDTO) {
    const porcentagem = 0;
    if (!this.metragem) {
      return 0;
    }

    const valorComDesconto = this.calcularTotal(plano);
    const valorOriginal = AgendamentoConstantes.calcularTotal(
      AgendamentoConstantes.VALOR_PADRAO_METRO, this.metragem, plano.qtdDias,
      porcentagem, this.profissionalSelecionado, false,
      TurnoEnum.NAO_DEFINIDO);

    return valorOriginal - valorComDesconto;
  }

  public calcularDiaria(plano: PlanoDTO) {
    if (!this.metragem) {
      return 0;
    }

    const valorComDesconto = this.calcularTotal(plano);
    return valorComDesconto / plano.qtdDias;
  }

  public comprar(plano: PlanoDTO) {
    if (!this.isUserNaoLogado()) {
      // this._router.navigate([Rota.LOGIN]);
    } else {
      // this.calcularTotal(plano);
      // this._router.navigate([Rota.PAGAMENTO]);

      const documentWidth = document.documentElement.clientWidth;
      const documentHeight = document.documentElement.clientHeight;
      let dialogRef = this.dialog.open(PagamentoComponent, {
        minWidth: `${documentWidth * 0.8}px`,
        maxWidth: `${documentWidth * 0.9}px`,
        minHeight: `90vh`,
        maxHeight: `100vh`,
      });

      dialogRef.afterClosed().subscribe(logout => {
      })
    }
  }

  private isUserNaoLogado(): boolean {
    const userMail: string | null = LocalStorageUtils.getUsuario();
    return !userMail;
  }

}
