import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviromment';
import { HistoricoPontoDTO } from '../domains/dtos/HistoricoPontoDTO';
import { DateUtils } from '../utils/DateUtils';

@Injectable({
  providedIn: 'root'
})
export class PontoService {
  private readonly HOST_URL = `${environment.apiUrl}/registro`;

  constructor(private _http: HttpClient) { }

  public cadastrar(ponto: HistoricoPontoDTO): Observable<HistoricoPontoDTO> {
    const url = `${this.HOST_URL}`;
    return this._http.post<HistoricoPontoDTO>(url, ponto);
  }

  public buscar(data: string, email: string): Observable<HistoricoPontoDTO> {
    const url = `${this.HOST_URL}/buscar`;
    let params = new HttpParams()
      .set('data', data)
      .set('email', email);

    return this._http.get<HistoricoPontoDTO>(url, { params })
  }
}