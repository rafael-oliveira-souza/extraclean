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

      if (DateUtils.isBefore(DateUtils.toMoment(authToken.expirationDate), DateUtils.toMoment(new Date()).subtract(20, 'minutes')), 'yyyy-MM-dd') {
        debugger
        this._authService.autenticar(authToken.username);
      }
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}