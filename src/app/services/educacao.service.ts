import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviromment';
import { Observable } from 'rxjs';
import { CartoesDTO } from '../domains/dtos/CartoesDTO';

@Injectable({
  providedIn: 'root'
})
export class EducacaoService {
  public readonly HOST_URL = `${environment.apiUrl}/estudo`;

  constructor(private _http: HttpClient) { }

  public gerarCartoes(temas: string[], bancas: string[]): Observable<CartoesDTO> {
    const url = `${this.HOST_URL}/buscar`;

    let params = new HttpParams()
      .set('temas', temas.join(', '))
      .set('bancas', bancas.join(', '));

    return this._http.get<CartoesDTO>(url, { params });
  }
}
