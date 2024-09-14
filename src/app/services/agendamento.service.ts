import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../enviromment';
import { AgendamentoDTO } from '../domains/dtos/AgendamentoDTO';
import { PagamentoMpDTO } from '../domains/dtos/PagamentoMpDto';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  public readonly HOST_URL = `${environment.apiUrl}/agendamento`;

  constructor(private _http: HttpClient) { }

  public agendar(agendamento: AgendamentoDTO): Observable<PagamentoMpDTO> {
    const url = `${this.HOST_URL}/criar`;
    return this._http.post<PagamentoMpDTO>(url, agendamento);
  }

  public recuperarHistorico(email: string): Observable<Array<AgendamentoDTO>> {
    const url = `${this.HOST_URL}/historico`;
    let params = new HttpParams()
      .set('email', email);

    return this._http.get<Array<AgendamentoDTO>>(url, { params });
  }
}
