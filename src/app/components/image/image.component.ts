import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {

  @Input("srcImage")
  public srcImage: string = "../../../assets/imgs/material-de-limpeza.gif";

  @Input("width")
  public width: string = "300px";

  @Input("height")
  public height: string = "300px";

  getUrlImage() {
    return `url('${this.srcImage}')`;
  }


}
