import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviromment';
import { AgendamentoDiariaDTO } from '../domains/dtos/AgendamentoDiariaDTO';
import { Observable } from 'rxjs';
import { TurnoEnum } from '../domains/enums/TurnoEnum';

@Injectable({
  providedIn: 'root'
})
export class DiariaService {
  public readonly HOST_URL = `${environment.apiUrl}/diaria`;

  constructor(private _http: HttpClient) { }
  public recuperarDiariasAgendadasMes(turno: TurnoEnum, data: Date): Observable<Array<AgendamentoDiariaDTO>> {
    const url = `${this.HOST_URL}/agendadas`;

    let params = new HttpParams()
      .set('turno', turno)
      .set('mes', data.getMonth() + 1)
      .set('ano', data.getFullYear());

    return this._http.get<Array<AgendamentoDiariaDTO>>(url, { params });
  }
}
