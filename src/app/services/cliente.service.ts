import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviromment';
import { ClienteDTO } from '../domains/dtos/ClienteDTO';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly HOST_URL = `${environment.apiUrl}/cliente`;

  constructor(private _http: HttpClient) { }

  public recuperarCliente(email: string | null): Observable<ClienteDTO> {
    const url = `${this.HOST_URL}/${email}`;
    return this._http.get<ClienteDTO>(url);
  }
  
  public salvar(cliente: ClienteDTO): Observable<ClienteDTO> {
    const url = `${this.HOST_URL}/criar`;
    return this._http.post<ClienteDTO>(url, cliente);
  }
  
  public criar(cliente: ClienteDTO): Observable<ClienteDTO> {
    const url = `${this.HOST_URL}/criar-completo`;
    return this._http.post<ClienteDTO>(url, cliente);
  }
}
