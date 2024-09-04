import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviromment';
import { UsuarioDTO } from '../domains/dtos/UsuarioDTO';
import { AgendamentoDiariaDTO } from '../domains/dtos/AgendamentoDiariaDTO';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public readonly HOST_URL = `${environment.apiUrl}/usuario`;

  constructor(private _http: HttpClient) { }

  public login(email: string, senha: string): Observable<UsuarioDTO> {
    const url = `${this.HOST_URL}/login`;
    let params = new HttpParams()
      .set('email', email)
      .set('senha', senha);

    return this._http.get<UsuarioDTO>(url, { params });
  }

  public cadastrar(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    const url = `${this.HOST_URL}/cadastro`;
    return this._http.post<UsuarioDTO>(url, usuario);
  }

  public isLoggedIn(): boolean {
    const user: string | null = LocalStorageUtils.getUsuario();
    return user != null;
  }
}
