import { Component, inject, OnInit } from '@angular/core';
import { PontoService } from '../../services/ponto.service';
import { DateUtils } from '../../utils/DateUtils';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoricoPontoDTO } from '../../domains/dtos/HistoricoPontoDTO';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '../titulo/titulo.component';

@Component({
  selector: 'app-ponto-profissional',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
  ],
  templateUrl: './ponto-profissional.component.html',
  styleUrls: ['./ponto-profissional.component.scss']
})
export class PontoProfissionalComponent implements OnInit {

  readonly data: any = inject<any>(MAT_DIALOG_DATA);
  public email: string = this.data['email'];
  public ponto: HistoricoPontoDTO = new HistoricoPontoDTO();

  constructor(private pontoService: PontoService) { }

  ngOnInit() {
    const dataIni = DateUtils.format(DateUtils.newDate(), DateUtils.ES);
    this.pontoService.buscar(dataIni, this.email)
      .subscribe((ponto: HistoricoPontoDTO) => {
        this.ponto.emailDiarista = this.email;
        this.ponto = ponto;
      });
  }

  public registrarEntrada() {
    this.ponto.entrada = DateUtils.newDate();
    this.pontoService.cadastrar(this.ponto)
      .subscribe((ponto: HistoricoPontoDTO) => {
        this.ponto = ponto;
      });
  }

  public registrarSaida() {
    this.ponto.saida = DateUtils.newDate();
    this.pontoService.cadastrar(this.ponto)
      .subscribe((ponto: HistoricoPontoDTO) => {
        this.ponto = ponto;
      });
  }

  public registrarIntervalo() {
    this.ponto.intervalo = DateUtils.newDate();
    this.pontoService.cadastrar(this.ponto)
      .subscribe((ponto: HistoricoPontoDTO) => {
        this.ponto = ponto;
      });
  }

}
