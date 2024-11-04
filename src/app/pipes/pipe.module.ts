import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPipe } from './data.pipe';
import { MoedaPipe } from './moeda.pipe';
import { CepPipe } from './cep.pipe';
import { TurnoPipe } from './turno.pipe';
import { MetragemPipe } from './metragem.pipe';
import { PontoPipe } from './ponto.pipe';
import { MetroPipe } from './metro.pipe';
import { SimNaoPipe } from './simNao.pipe';
import { TipoServicoPipe } from './tipoServico.pipe';
import { TipoClientePipe } from './tipoCliente.pipe';
import { SituacaoAgendamentoPipe } from './situacaoAgendamento.pipe';
import { SituacaoDiariaPipe } from './situacaoDiaria.pipe';
import { SituacaoPagamentoPipe } from './situacaoPagamento.pipe';
import { HorasDiariaPipe } from './horasDiaria.pipe';
import { TaxaCartaoPipe } from './taxa-cartao.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MoedaPipe,
    CepPipe,
    DataPipe,
    TurnoPipe,
    MetragemPipe,
    PontoPipe,
    MetroPipe,
    SimNaoPipe,
    TipoServicoPipe,
    TipoClientePipe,
    SituacaoAgendamentoPipe,
    SituacaoDiariaPipe,
    SituacaoPagamentoPipe,
    HorasDiariaPipe,
    TaxaCartaoPipe,
  ],
  exports: [
    DataPipe,
    MoedaPipe,
    CepPipe,
    TurnoPipe,
    MetragemPipe,
    PontoPipe,
    MetroPipe,
    SimNaoPipe,
    TipoServicoPipe,
    TipoClientePipe,
    SituacaoAgendamentoPipe,
    SituacaoDiariaPipe,
    SituacaoPagamentoPipe,
    HorasDiariaPipe,
    TaxaCartaoPipe,
  ]
})
export class PipeModule { }
