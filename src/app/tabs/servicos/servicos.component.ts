import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../pipes/pipe.module';
import { ServicoDTO } from '../../domains/dtos/ServicoDTO';
import { MatExpansionModule } from '@angular/material/expansion';

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
    MatExpansionModule,
    PipeModule,
  ],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss'
})
export class ServicosComponent {

  public servicos: Array<ServicoDTO> = [];



  constructor() {
    this.servicos.push(new ServicoDTO("Limpeza Residencial",
      "É um serviço rápido e eficiente que oferece uma solução prática para a manutenção da sua casa ou escritório.",
      "" +
      "    <ul>\n" +
      "        <li>Limpeza dos móveis</li>\n" +
      "        <li> Limpeza com água</li>\n" +
      "        <li>Troca de lençóis </li>\n" +
      "        <li>Arraste de móveis e tapetes para limpeza completa </li>\n" +
      "        <li>Remoção de pó </li>\n" +
      "        <li>Limpeza externa de eletrodomésticos </li>\n" +
      "        <li>Limpeza interna de janelas </li>\n" +
      "        <li>Lavagem de louça</li>\n" +
      "        <li>Limpeza de banheiros</li>\n" +
      "    </ul>"
      , "home", "../../../assets/imgs/servicos/expressa.jpeg"))
    this.servicos.push(new ServicoDTO("Pré Mudança",
      "É um serviço focado em locais vazios, projetado para proporcionar uma limpeza profunda em cada canto do seu novo espaço. ",
      "<ul>\n" +
      "        <li>Limpeza de mesas</li>\n" +
      "        <li>Remoção de pó </li>\n" +
      "        <li>Limpeza externa de eletrodomésticos </li>\n" +
      "        <li>Limpeza interna de janelas </li>\n" +
      "        <li>Lavagem de louça</li>\n" +
      "        <li>Limpeza de banheiros</li>\n" +
      "</ul>\n", "house", "../../../assets/imgs/servicos/detalhada.jpeg"))
    this.servicos.push(new ServicoDTO("Limpeza Empresarial",
      "É um serviço profissional projetado para manter a higiene e a apresentação impecável de ambientes de trabalho.",
      "    <ul>\n" +
      "        <li>Limpeza de mesas</li>\n" +
      "        <li>Remoção de pó </li>\n" +
      "        <li>Limpeza externa de eletrodomésticos </li>\n" +
      "        <li>Limpeza interna de janelas </li>\n" +
      "        <li>Lavagem de louça</li>\n" +
      "        <li>Limpeza de banheiros</li>\n" +
      "    </ul>",
      "factory", "../../../assets/imgs/servicos/empresarial.jpeg"))
    this.servicos.push(new ServicoDTO("Passadoria",
      "É um serviço especializado em cuidados com roupas, focado em garantir que suas peças estejam sempre apresentáveis e em perfeito estado.",
      "    <ul>\n" +
      "        <li>Cuidado com Tecidos Delicados</li>\n" +
      "        <li>Eliminação de Rugas</li>\n" +
      "        <li>Passagem de Várias Peças</li>\n" +
      "        <li>Acabamento Profissional</li>\n" +
      "        <li>Preparação para Eventos Especiais</li>\n" +
      "    </ul>"
      , "iron", "../../../assets/imgs/servicos/passadoria.jpeg"))
    // this.servicos.push(new ServicoDTO("Terceirização", "Terceirização de Mão de Obra com Qualidade. Conte Com a Excelência de Nossos Serviços.", "groups"))
  }
}
