import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AgendamentoConstantes } from '../../domains/constantes/AgendamentoConstantes';

@Component({
  selector: 'app-itens-limpeza',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './itens-limpeza.component.html',
  styleUrls: ['./itens-limpeza.component.scss']
})
export class ItensLimpezaComponent implements OnInit {
  public readonly MAX_PERCENTUAL = AgendamentoConstantes.MAX_PERCENTUAL;

  @Input('exibeInfoValores')
  public exibeInfoValores: boolean = false;

  @Input('exibeInfoProdutos')
  public exibeInfoProdutos: boolean = false;

  @Input('isLimpezaDetalhada')
  public isLimpezaDetalhada: boolean = false;

  @Input('exibeTipoLimpeza')
  public exibeTipoLimpeza: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
