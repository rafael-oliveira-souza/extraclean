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
import { ClienteDTO } from '../domains/dtos/ClienteDTO';
import { PerfilComponent } from '../components/perfil/perfil.component';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from './cliente.service';
import { NotificacaoService } from './notificacao.service';
import { MensagemEnum } from '../domains/enums/MensagemEnum';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  public readonly HOST_URL = `${environment.apiUrl}/autenticacao`;

  constructor(private dialog: MatDialog, private _http: HttpClient,
    private _clienteService: ClienteService,
    private _notificacaoService: NotificacaoService,
    private _router: Router) { }

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

  public isAdminLoggedIn(): boolean {
    const auth: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
    return auth != null && auth.tipoUsuario == 0;
  }

  public isLoggedIn(): boolean {
    const auth = this.getUsuarioAutenticado();
    return auth != null;
  }

  public validarUsuario(abrePerfilCliente: boolean, abreMensagem: boolean) {
    const email: string | null = this.getUsuarioAutenticado();
    if (email == null) {
      this._router.navigate([Rota.LOGIN]);
      return;
    }

    LocalStorageUtils.setItem(LocalStorageUtils.USUARIO_CACHE_EMAIL, email);
    let clienteRecuperado: ClienteDTO | null = LocalStorageUtils.getCliente();
    if (abrePerfilCliente) {
      if (!clienteRecuperado) {
        this._clienteService.recuperarCliente(email)
          .subscribe((cliente: ClienteDTO) => {
            clienteRecuperado = cliente;
            if (abreMensagem) {
              this.enviarNotificacaoPerfil(cliente);
            }
            LocalStorageUtils.setCliente(cliente);
            this.abrirPagina(PerfilComponent, cliente, email);
          }, (error) => this._router.navigate([Rota.LOGIN]));
      } else {
        if (abreMensagem) {
          this.enviarNotificacaoPerfil(clienteRecuperado);
        }
        this.abrirPagina(PerfilComponent, clienteRecuperado, email);
        LocalStorageUtils.setCliente(clienteRecuperado);
      }
    } else if (abreMensagem) {
      if (!clienteRecuperado) {
        this._clienteService.recuperarCliente(email)
          .subscribe((cliente: ClienteDTO) => {
            clienteRecuperado = cliente;
            LocalStorageUtils.setCliente(clienteRecuperado);
            if (this.enviarNotificacaoPerfil(clienteRecuperado)) {
              this.abrirPagina(PerfilComponent, clienteRecuperado, email);
            }
          }, (error) => this._router.navigate([Rota.LOGIN]));
      } else {
        LocalStorageUtils.setCliente(clienteRecuperado);
        if (this.enviarNotificacaoPerfil(clienteRecuperado)) {
          this.abrirPagina(PerfilComponent, clienteRecuperado, email);
        }
      }
    }

    return email;
  }

  private enviarNotificacaoPerfil(cliente: ClienteDTO | null) {
    if (!cliente || !cliente.endereco || !cliente.nome || !cliente.telefone) {
      this._notificacaoService.alerta(MensagemEnum.NECESSARIO_ATUALIZAR_PERFIL);
      return true;
    }

    return false;
  }

  private abrirPagina(component: ComponentType<any>, data: any, email: string) {
    let dialogRef;
    if (typeof document !== 'undefined') {
      const documentWidth = document.documentElement.clientWidth;
      const documentHeigth = document.documentElement.clientHeight;
      dialogRef = this.dialog.open(component, {
        minWidth: `${documentWidth * 0.8}px`,
        maxWidth: `${documentWidth * 0.9}px`,
        minHeight: `${documentHeigth * 0.9}px`,
        maxHeight: `${documentHeigth * 0.95}px`,
        data: {
          email: email,
          data: data
        }
      });
    } else {
      dialogRef = this.dialog.open(component, {
        minWidth: `90%`,
        maxWidth: `100%`,
        minHeight: '90%',
        maxHeight: '100%',
        data: {
          email: email,
          data: data
        }
      });
    }
  }
}