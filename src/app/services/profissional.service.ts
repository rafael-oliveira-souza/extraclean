import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ProfissionalDTO } from '../domains/dtos/ProfissionalDTO';
import { environment } from '../../enviromment';
import { AgendamentoDiariaDTO } from '../domains/dtos/AgendamentoDiariaDTO';
import { TurnoEnum } from '../domains/enums/TurnoEnum';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  public readonly HOST_URL = `${environment.apiUrl}/profissional`;

  constructor(private _http: HttpClient) { }

  public get(): Observable<Array<ProfissionalDTO>> {
    const url = `${this.HOST_URL}/listar`;
    return this._http.get<Array<ProfissionalDTO>>(url);
    // return of([new ProfissionalDTO(1, "Andrea"), new ProfissionalDTO(2, "Joana")]);
  }

  public salvar(profs: ProfissionalDTO[]): Observable<ProfissionalDTO[]> {
    const url = `${this.HOST_URL}/salvar-lote`;
    return this._http.post<ProfissionalDTO[]>(url, profs);
  }

  public recuperarDiariasPorProfissional(idProfissional: number, turno: TurnoEnum, data: Date): Observable<Array<AgendamentoDiariaDTO>> {
    const url = `${this.HOST_URL}/${idProfissional}/diarias`;

    let params = new HttpParams()
      .set('turno', turno)
      .set('mes', data.getMonth() + 1)
      .set('ano', data.getFullYear());

    return this._http.get<Array<AgendamentoDiariaDTO>>(url, { params });
  }
}
