import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-legenda',
  standalone: true,
  imports: [],
  templateUrl: './legenda.component.html',
  styleUrl: './legenda.component.scss'
})
export class LegendaComponent {

  @Input('cor')
  public cor: string = "";

  @Input('label')
  public label: string = "";

  @Input('largura')
  public largura: string = "15px";

  @Input('altura')
  public altura: string = "15px";

}
