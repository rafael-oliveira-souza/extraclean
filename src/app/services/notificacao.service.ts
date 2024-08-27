import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  private config: MatSnackBarConfig = {
    duration: 3000,
    direction: 'ltr',
    horizontalPosition: 'end',
    verticalPosition: 'top'

  }

  constructor(private _snackBar: MatSnackBar) { }

  public alerta(msg: string) {
    this._snackBar.open(msg, "", this.config);
  }

  public erro(msg: any) {
    this._snackBar.open(msg, "", this.config);
  }
}
