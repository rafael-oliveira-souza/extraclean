import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ProfissionalDTO } from '../domains/dtos/ProfissionalDTO';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {

  constructor(private _http: HttpClient) { }

  public get(): Observable<Array<ProfissionalDTO>> {
    // const cepUrl = `https://viacep.com.br/ws/3213/json/`;
    // return this._http.get<Array<ProfissionalDTO>>(cepUrl);
    return of([new ProfissionalDTO(1, "Andrea"), new ProfissionalDTO(2, "Joana")]);
  }
}
