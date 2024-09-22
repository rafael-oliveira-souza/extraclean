import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';
import { MoedaPipe } from './moeda.pipe';
import { CepPipe } from './cep.pipe';
import { TurnoPipe } from './turno.pipe';
import { MetragemPipe } from './metragem.pipe';
import { PontoPipe } from './ponto.pipe';
import { MetroPipe } from './metro.pipe';
import { SimNaoPipe } from './simNao.pipe';
import { TipoLimpezaPipe } from './tipoLimpeza.pipe';
import { TipoClientePipe } from './tipoCliente.pipe';
import { SituacaoAgendamentoPipe } from './situacaoAgendamento.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MoedaPipe,
    CepPipe,
    DatePipe,
    TurnoPipe,
    MetragemPipe,
    PontoPipe,
    MetroPipe,
    SimNaoPipe,
    TipoLimpezaPipe,
    TipoClientePipe,
    SituacaoAgendamentoPipe,
  ],
  exports: [
    DatePipe,
    MoedaPipe,
    CepPipe,
    TurnoPipe,
    MetragemPipe,
    PontoPipe,
    MetroPipe,
    SimNaoPipe,
    TipoLimpezaPipe,
    TipoClientePipe,
    SituacaoAgendamentoPipe,
  ]
})
export class PipeModule { }
