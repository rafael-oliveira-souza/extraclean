import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CepDTO } from '../domains/dtos/CepDTO';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private _http: HttpClient) { }

  public getCep(cep: string): Observable<CepDTO> {
    const cepUrl = `https://viacep.com.br/ws/${cep}/json/`;
    return this._http.get<CepDTO>(cepUrl);
  }
}
