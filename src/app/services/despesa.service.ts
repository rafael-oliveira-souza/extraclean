import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviromment';
import { DespesaDTO } from '../domains/dtos/DespesaDTO';
import { ClienteDTO } from '../domains/dtos/ClienteDTO';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  public readonly HOST_URL = `${environment.apiUrl}/despesa`;

  constructor(private _http: HttpClient) { }

  public salvar(despesa: DespesaDTO): Observable<DespesaDTO[]> {
    const url = `${this.HOST_URL}/adicionar`;
    return this._http.post<DespesaDTO[]>(url, despesa);
  }

  public excluir(despesa: DespesaDTO): Observable<any> {
    const url = `${this.HOST_URL}/excluir`;
    return this._http.post(url, despesa);
  }

  public recuperarPorPeriodo(dataInicio: string, dataFim: string): Observable<Array<DespesaDTO>> {
    const url = `${this.HOST_URL}/todas`;

    let params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this._http.get<Array<DespesaDTO>>(url, { params });
  }

  public recuperarFuncionariosAtivos(): Observable<Array<ClienteDTO>> {
    const url = `${this.HOST_URL}/usuarios`;

    return this._http.get<Array<ClienteDTO>>(url);
  }

}
