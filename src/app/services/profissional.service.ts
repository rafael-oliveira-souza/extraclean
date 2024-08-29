import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ProfissionalDTO } from '../domains/dtos/ProfissionalDTO';
import { environment } from '../../enviromment';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private readonly HOST_URL = `${environment.apiUrl}`;

  constructor(private _http: HttpClient) { }

  public get(): Observable<Array<ProfissionalDTO>> {
    const url = `${this.HOST_URL}/diarista/listar`;
    return this._http.get<Array<ProfissionalDTO>>(url);
    // return of([new ProfissionalDTO(1, "Andrea"), new ProfissionalDTO(2, "Joana")]);
  }
}
