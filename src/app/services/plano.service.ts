import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviromment';
import { PlanoDTO } from '../domains/dtos/PlanoDTO';
import { PagamentoMpDTO } from '../domains/dtos/PagamentoMpDto';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
  public readonly HOST_URL = `${environment.apiUrl}/plano`;

  constructor(private _http: HttpClient) { }

  public criar(plano: PlanoDTO): Observable<PagamentoMpDTO> {
    const url = `${this.HOST_URL}/criar`;
    return this._http.post<PagamentoMpDTO>(url, plano);
  }
}
