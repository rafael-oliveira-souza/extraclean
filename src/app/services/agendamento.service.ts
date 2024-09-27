import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../enviromment';
import { AgendamentoDTO } from '../domains/dtos/AgendamentoDTO';
import { PagamentoMpDTO } from '../domains/dtos/PagamentoMpDto';
import { HistoricoAgendamentoDTO } from '../domains/dtos/HistoricoAgendamentoDTO';
import { RegistroAgendamentoDTO } from '../domains/dtos/RegistroAgendamentoDTO';
import { InfoAgendamentoDTO } from '../domains/dtos/InfoAgendamentoDTO';
import { FinalizacaoAgendamentoDTO } from '../domains/dtos/FinalizacaoAgendamentoDTO';

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

  public recuperarHistorico(email: string): Observable<Array<HistoricoAgendamentoDTO>> {
    const url = `${this.HOST_URL}/historico`;
    let params = new HttpParams()
      .set('email', email);

    return this._http.get<Array<HistoricoAgendamentoDTO>>(url, { params });
  }

  public registrarHorarioAtendimento(registro: RegistroAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/registrar-horario`;
    return this._http.patch<any>(url, registro);
  }

  public recuperarInfoAgendamentos(dataInicio: string): Observable<Array<InfoAgendamentoDTO>> {
    const url = `${this.HOST_URL}/info/periodo`;
    let params = new HttpParams()
      .set('dataInicio', dataInicio);

    return this._http.get<Array<InfoAgendamentoDTO>>(url, { params });
  }
  
  public finalizarAgendamento(obj: FinalizacaoAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/finalizar`;
    return this._http.post<any>(url, obj);
  }

}
