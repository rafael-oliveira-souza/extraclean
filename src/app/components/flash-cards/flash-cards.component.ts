import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PipeModule } from '../../pipes/pipe.module';
import { MatIconModule } from '@angular/material/icon';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EducacaoService } from '../../services/educacao.service';
import { CartoesDTO, Flashcard } from '../../domains/dtos/CartoesDTO';
import { register } from 'swiper/element/bundle';
import { NotificacaoService } from '../../services/notificacao.service';

register();

@Component({
  selector: 'app-flash-cards',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './flash-cards.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    PipeModule,
    MatChipsModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./flash-cards.component.scss']
})
export class FlashCardsComponent implements OnInit {
  public readonly bancas: Array<string> = [
    "CESPE/CEBRASPE",
    "FGV",
    "FCC",
    "VUNESP",
    "IBFC",
    "INSTITUTO AOCP",
    "QUADRIX",
    "CONSULPLAN",
    "FUNRIO",
    "FUNCAB",
    "IDECAN",
    "COSEAC",
    "NC UFPR",
    "UFPR",
    "UFG",
    "UFRGS",
    "UFMG",
    "UFPE",
    "CESGRANRIO",
    "FUNDACAO GETULIO VARGAS"
  ];

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly temas = signal<string[]>([
    // 'Direito Administrativo', 
    // 'Raciocínio Lógico', 
    // 'Redes de Computadores'
  ]);
  readonly announcer = inject(LiveAnnouncer);

  public bancasSelecionadas: Array<string> = ["TODAS"];
  public tema: Array<string> = [];
  public dificuldade: string = "TODAS";
  public qtdCartoes: number = 5;
  public prova: string = "";

  public indiceAtual = 0;
  public flashs: Flashcard[] = [];

  constructor(private _educacaoService: EducacaoService,
    private _notificacoService: NotificacaoService
  ) { }

  ngOnInit() { }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tema
    if (value) {
      this.temas.update(temas => [...temas, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tema: string): void {
    this.temas.update(temas => {
      const index = temas.indexOf(tema);
      if (index < 0) {
        return temas;
      }

      temas.splice(index, 1);
      this.announcer.announce(`Removed ${tema}`);
      return [...temas];
    });
  }

  edit(tema: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tema if it no longer has a name
    if (!value) {
      this.remove(tema);
      return;
    }

    // Edit existing tema
    this.temas.update(temas => {
      const index = temas.indexOf(tema);
      if (index >= 0) {
        temas[index] = value;
        return [...temas];
      }
      return temas;
    });
  }

  public gerarCartoes() {
    this._educacaoService.gerarCartoes(this.temas(), this.bancasSelecionadas)
      .subscribe((card: CartoesDTO) => {
        this.flashs = this.shuffle(card);
      });
  }


  public selecionarProxima() {
    this.indiceAtual++;
    if (this.indiceAtual >= this.flashs.length) {
      this._notificacoService.alerta("Parabéns!! Você finalizou os seus cartões.");
      this.indiceAtual = 0;
    }
  }

  private shuffle(card: CartoesDTO): Flashcard[] {
    const flashs = Object.values(card.flashs).flat();
    const result = [...flashs]; // não altera o original
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }
}
