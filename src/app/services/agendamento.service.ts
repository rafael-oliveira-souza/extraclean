import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../enviromment';
import { AgendamentoDTO } from '../domains/dtos/AgendamentoDTO';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly HOST_URL = `${environment.apiUrl}/agendamento`;

  constructor(private _http: HttpClient) { }

  public agendar(agendamento: AgendamentoDTO): Observable<Boolean> {
    const url = `${this.HOST_URL}/criar`;
    return this._http.post<Boolean>(url, agendamento);
  }
}
