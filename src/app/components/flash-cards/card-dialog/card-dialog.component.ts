import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, model, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Flashcard } from '../../../domains/dtos/CartoesDTO';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './card-dialog.component.html',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  styleUrls: ['./card-dialog.component.scss']
})
export class CardDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CardDialogComponent>);
  readonly flashs = inject<Flashcard[]>(MAT_DIALOG_DATA);
  public isFlipped = false;

  @ViewChild('swiper', { static: false })
  swiperRef!: ElementRef<any>;

  constructor() { }

  ngOnInit() { }

  avancar() {
    this.swiperRef.nativeElement.swiper.slideNext();
  }

  voltar() {
    this.swiperRef.nativeElement.swiper.slidePrev();
  }
}