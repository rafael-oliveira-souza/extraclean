import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnderecoDTO } from '../domains/dtos/EnderecoDTO';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private _http: HttpClient) { }

  public getCep(cep: string): Observable<EnderecoDTO> {
    const cepUrl = `https://viacep.com.br/ws/${cep}/json/`;
    return this._http.get<EnderecoDTO>(cepUrl);
  }
}
