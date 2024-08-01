import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../pipes/pipe.module';
import { ServicoDTO } from '../../domains/dtos/ServicoDTO';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    PipeModule,
  ],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss'
})
export class ServicosComponent {

  public servicos: Array<ServicoDTO> = [];

  constructor() {
    this.servicos.push(new ServicoDTO("Condomínio", "Temos funcionários treinados, capacitados e compromissados com os resultados pretendidos.", "apartment"))
    this.servicos.push(new ServicoDTO("Residencial", "Limpeza residencial, empresas, sanitização e cuidados domésticos em geral.", "home"))
    this.servicos.push(new ServicoDTO("Limpeza pós obra", "Somos especialistas de mão de obra terceirizada para empresas em Brasília em limpeza pós obra.", "construction"))
    this.servicos.push(new ServicoDTO("Indústria", "Na limpeza industrial é feita a higienização e desinfecção de todos os equipamentos.", "factory"))
    this.servicos.push(new ServicoDTO("Terceirização", "Terceirização de Mão de Obra com Qualidade. Conte Com a Excelência de Nossos Serviços.", "groups"))
  }
}
