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
    this.servicos.push(new ServicoDTO("Limpeza Expressa",
      "É um serviço rápido e eficiente que oferece uma solução prática para a manutenção da sua casa ou escritório.",
      "    <ul>\n" +
      "        <li>Limpeza externa dos móveis</li>\n" +
      "        <li>Passamos pano jogando água</li>\n" +
      "        <li>Trocamos os lençóis</li>\n" +
      "        <li>Arrastamos móveis e tapetes para uma limpeza completa</li>\n" +
      "        <li>Tiramos o pó</li>\n" +
      "        <li>Limpamos os eletrodomésticos externamente</li>\n" +
      "        <li>Limpamos as janelas apenas pela parte interna</li>\n" +
      "        <li>Lavamos a louça, porém não guardamos</li>\n" +
      "        <li>Lavamos o banheiro</li>\n" +
      "    </ul>"
      , "home", "../../../assets/imgs/servicos/expressa.jpeg"))
    this.servicos.push(new ServicoDTO("Limpeza Detalhada",
      "É um serviço completo e minucioso, projetado para proporcionar uma limpeza profunda em cada canto do seu espaço. ",
      "<ul>\n" +
      "  <li>Limpeza externa e interna dos armários da cozinha e da geladeira</li>\n" +
      "  <li>Passamos pano jogando água</li>\n" +
      "  <li>Trocamos os lençóis</li>\n" +
      "  <li>Arrastamos móveis e tapetes para uma limpeza completa</li>\n" +
      "  <li>Tiramos o pó</li>\n" +
      "  <li>Limpamos o banheiro</li>\n" +
      "  <li>Limpamos as janelas apenas pela parte interna</li>\n" +
      "  <li>Lavamos a louça e guardamos</li>\n" +
      "  <li>Limpamos móveis da casa externamente</li>\n" +
      "</ul>\n", "house", "../../../assets/imgs/servicos/detalhada.jpeg"))
    this.servicos.push(new ServicoDTO("Limpeza Empresarial",
      "É um serviço profissional projetado para manter a higiene e a apresentação impecável de ambientes de trabalho.",
      "    <ul>\n" +
      "        <li>Lavamos o banheiro</li>\n" +
      "        <li>Lavamos e guardamos a louça</li>\n" +
      "        <li>Limpamos a janela somente pela parte interna</li>\n" +
      "        <li>Limpamos o chão passando pano</li>\n" +
      "    </ul>",
      "factory", "../../../assets/imgs/servicos/empresarial.jpeg"))
    this.servicos.push(new ServicoDTO("Passadoria",
      "É um serviço especializado em cuidados com roupas, focado em garantir que suas peças estejam sempre apresentáveis e em perfeito estado.",
      "    <ul>\n" +
      "        <li>8:00 - 12:00 - Média de 60 Peças</li>\n" +
      "        <li>14:00 - 17:00 - Média de 40 Peças</li>\n" +
      "        <li>8:00 - 12:00 / 14:00 - 17:00 - Média de 80 Peças</li>\n" +
      "    </ul>"
      , "iron", "../../../assets/imgs/servicos/passadoria.jpeg"))
    // this.servicos.push(new ServicoDTO("Terceirização", "Terceirização de Mão de Obra com Qualidade. Conte Com a Excelência de Nossos Serviços.", "groups"))
  }
}
