import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';
import { AutenticacaoService } from '../services/autenticacao.service';
import { AutenticacaoDTO } from '../domains/dtos/AutenticacaoDTO';
import { DateUtils } from '../utils/DateUtils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AutenticacaoService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("/autenticar")) {
      return next.handle(req);
    }

    const authToken: AutenticacaoDTO | null = LocalStorageUtils.getAuth();
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken.token}`)
      });

      this.scheduleTokenExpiryCheck(authToken.expirationDate, () => { this._authService.autenticar(authToken.username); });
      return next.handle(authReq);
    }

    return next.handle(req);
  }

  private scheduleTokenExpiryCheck(tokenExpiryTime: Date, callback: Function) {
    const currentTime = new Date().getTime(); // Pega o tempo atual em milissegundos
    const expiryTime = new Date(tokenExpiryTime).getTime(); // Converte o tempo de expiração do token para milissegundos

    // Calcula o tempo restante até a expiração do token
    const timeRemaining = expiryTime - currentTime;

    // Se restarem menos de 20 minutos, chama o callback imediatamente
    const twentyMinutesInMilliseconds = 20 * 60 * 1000;

    if (timeRemaining <= twentyMinutesInMilliseconds) {
      callback();
    } else {
      // Agende a execução do callback quando faltarem exatamente 20 minutos para expirar
      const scheduleTime = timeRemaining - twentyMinutesInMilliseconds;

      setTimeout(() => {
        callback();
      }, scheduleTime);
    }
  }

}