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
    this.servicos.push(new ServicoDTO("Limpeza Residencial", "Limpeza residencial, sanitização e cuidados domésticos em geral.", "home"))
    this.servicos.push(new ServicoDTO("Limpeza Pré Mudança", " Nosso serviço de limpeza pré-mudança é projetado para garantir que seu novo lar ou escritório esteja completamente pronto para receber você, livre de sujeira, poeira e resíduos.", "construction"))
    this.servicos.push(new ServicoDTO("Limpeza Empresarial", "Nosso serviço de limpeza empresarial oferece soluções completas e personalizadas para atender às necessidades específicas de sua empresa, garantindo que seus espaços de trabalho estejam sempre limpos, organizados e prontos para o sucesso.", "factory"))
    // this.servicos.push(new ServicoDTO("Terceirização", "Terceirização de Mão de Obra com Qualidade. Conte Com a Excelência de Nossos Serviços.", "groups"))
  }
}
