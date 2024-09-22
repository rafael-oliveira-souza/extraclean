import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviromment';
import { UsuarioDTO } from '../domains/dtos/UsuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly HOST_URL = `${environment.apiUrl}/usuario`;

  constructor(private _http: HttpClient) { }

  public cadastrar(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    const url = `${this.HOST_URL}/cadastro`;
    return this._http.post<UsuarioDTO>(url, usuario);
  }

  public atualizarSenha(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    const url = `${this.HOST_URL}/atualizar-senha`;
    return this._http.post<UsuarioDTO>(url, usuario);
  }

}
