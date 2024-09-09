import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../enviromment';
import { UsuarioDTO } from '../domains/dtos/UsuarioDTO';
import { AgendamentoDiariaDTO } from '../domains/dtos/AgendamentoDiariaDTO';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';
import { AutenticacaoDTO } from '../domains/dtos/AutenticacaoDTO';
import { Router } from '@angular/router';
import { Rota } from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  public readonly HOST_URL = `${environment.apiUrl}/autenticacao`;

  constructor(private _http: HttpClient, private _router: Router) { }

  public login(email: string, senha: string): Observable<UsuarioDTO> {
    const url = `${this.HOST_URL}/login`;
    let usuario = new UsuarioDTO();
    usuario.email = email;
    usuario.senha = senha;

    return this._http.post<UsuarioDTO>(url, usuario)
      .pipe(
        tap(data => this.autenticar(usuario.email)),  // Executa ação em caso de sucesso
        catchError(error => {
          this.logout();
          return throwError(() => error);  // Retorna o erro para o subscriber lidar com ele
        }));
  }

  public autenticar(email: string): void {
    const url = `${this.HOST_URL}/autenticar`;

    let params = new HttpParams()
      .set('email', email);

    this._http.get<AutenticacaoDTO>(url, { params })
      .subscribe((auth: AutenticacaoDTO) => {
        LocalStorageUtils.setAuth(auth);
      });
  }

  public logout(): void {
    const url = `${this.HOST_URL}/logout`;
    const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();

    if (auth == null) {
      LocalStorageUtils.clear();
      this._router.navigate([Rota.LOGIN]);
      return;
    }

    this._http.get<AutenticacaoDTO>(url)
      .subscribe((auth: AutenticacaoDTO) => {
        LocalStorageUtils.removeCacheAutenticacao();
      });
  }

  public getUsuarioAutenticado(): string | null {
    const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
    if (auth != null && auth.autenticado) {
      return auth.username;
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const auth = this.getUsuarioAutenticado();
    return auth != null;
  }
}