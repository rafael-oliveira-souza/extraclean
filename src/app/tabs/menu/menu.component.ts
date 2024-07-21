import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CalendarioComponent } from "../../components/calendario/calendario.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, CalendarioComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
