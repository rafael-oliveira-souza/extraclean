import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ProfissionalDTO } from '../domains/dtos/ProfissionalDTO';
import { environment } from '../../enviromment';
import { AgendamentoDiariaDTO } from '../domains/dtos/AgendamentoDiariaDTO';
import { TurnoEnum } from '../domains/enums/TurnoEnum';
import { CalculoFuncionarioDTO } from '../domains/dtos/CalculoFuncionarioDTO';
import { ContraChequeProfissionalDTO } from '../domains/dtos/ContraChequeProfissionalDTO';
import { PagamentoProfissionalDTO } from '../domains/dtos/PagamentoProfissionalDTO';

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

  public todos(): Observable<Array<ProfissionalDTO>> {
    const url = `${this.HOST_URL}/todos`;
    return this._http.get<Array<ProfissionalDTO>>(url);
  }

  public calcularGastosFuncionario(obj: CalculoFuncionarioDTO): Observable<CalculoFuncionarioDTO> {
    const url = `https://www.idinheiro.com.br/calculadoras/calculadora-custo-de-funcionario-para-empresa/`;
    return this._http.post<CalculoFuncionarioDTO>(url, obj);
  }

  public salvarPagamentoProfissional(pagamento: PagamentoProfissionalDTO): Observable<PagamentoProfissionalDTO[]> {
    const url = `${this.HOST_URL}/pagamentos/adicionar`;
    return this._http.post<PagamentoProfissionalDTO[]>(url, pagamento);
  }

  public excluirPagamentoProfissional(pagamento: PagamentoProfissionalDTO): Observable<any> {
    const url = `${this.HOST_URL}/pagamentos/excluir`;
    return this._http.post(url, pagamento);
  }

  public salvar(profs: ProfissionalDTO[]): Observable<ProfissionalDTO[]> {
    const url = `${this.HOST_URL}/salvar-lote`;
    return this._http.post<ProfissionalDTO[]>(url, profs);
  }

  public recuperarTodosPagamentosProfissionais(dataInicio: string, dataFim: string): Observable<Array<PagamentoProfissionalDTO>> {
    const url = `${this.HOST_URL}/pagamentos/todos`;

    let params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this._http.get<Array<PagamentoProfissionalDTO>>(url, { params });
  }

  public recuperarValoresRecebidosProfissionalPorPeriodo(idProfissional: number, dataInicio: string, dataFim: string): Observable<ContraChequeProfissionalDTO> {
    const url = `${this.HOST_URL}/pagamentos/${idProfissional}`;

    let params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this._http.get<ContraChequeProfissionalDTO>(url, { params });
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
