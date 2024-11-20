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
import { InfoDiariaDTO } from '../domains/dtos/InfoDiariaDTO';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly HOST_URL = `${environment.apiUrl}/agendamento`;

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

  public atualizarInfoDiaria(diaria: InfoDiariaDTO): Observable<InfoDiariaDTO> {
    const url = `${this.HOST_URL}/info/diaria`;
    return this._http.post<InfoDiariaDTO>(url, diaria);
  }

  public buscarInfoDiarias(dataDiaria: string | null, email: string | null): Observable<Array<InfoDiariaDTO>> {
    const url = `${this.HOST_URL}/info/diarias`;
    let params = new HttpParams()
      .set('dataDiaria', dataDiaria ? dataDiaria : "")
      .set('email', email ? email : "");

    return this._http.get<Array<InfoDiariaDTO>>(url, { params });
  }

  public registrarHorarioAtendimento(registro: RegistroAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/registrar-horario`;
    return this._http.patch<any>(url, registro);
  }

  public recuperarInfoAgendamentos(dataInicio: string, dataFim: string | null, email: string | null): Observable<Array<InfoAgendamentoDTO>> {
    const url = `${this.HOST_URL}/info/periodo`;
    let params = new HttpParams()
      .set('dataFim', dataFim ? dataFim : "")
      .set('email', email ? email : "")
      .set('dataInicio', dataInicio);

    return this._http.get<Array<InfoAgendamentoDTO>>(url, { params });
  }

  public finalizarAgendamento(obj: FinalizacaoAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/finalizar`;
    return this._http.post<any>(url, obj);
  }

  public confirmarPagamento(obj: FinalizacaoAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/confirmar-pagamento`;
    return this._http.post<any>(url, obj);
  }

  public atualizarProfissionalAgendamento(obj: FinalizacaoAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/atualizar-profissional`;
    return this._http.post<any>(url, obj);
  }

  public cancelarAgendamento(obj: FinalizacaoAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/cancelar`;
    return this._http.post<any>(url, obj);
  }

  public reagendarAgendamento(obj: FinalizacaoAgendamentoDTO): Observable<any> {
    const url = `${this.HOST_URL}/reagendar`;
    return this._http.post<any>(url, obj);
  }

}
