import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../enviromment';
import { AgendamentoDiariaDTO } from '../domains/dtos/AgendamentoDiariaDTO';
import { TurnoEnum } from '../domains/enums/TurnoEnum';

@Injectable({
  providedIn: 'root'
})
export class DiaristaService {
  private readonly HOST_URL = `${environment.apiUrl}/profissional`;

  constructor(private _http: HttpClient) { }

  public recuperarDiariasPorProfissional(idProfissional: number, turno: TurnoEnum, data: Date): Observable<Array<AgendamentoDiariaDTO>> {
    const url = `${this.HOST_URL}/${idProfissional}/diarias`;

    let params = new HttpParams()
      .set('turno', turno)
      .set('mes', data.getMonth() + 1)
      .set('ano', data.getFullYear());

    return this._http.get<Array<AgendamentoDiariaDTO>>(url, { params });
  }
}
