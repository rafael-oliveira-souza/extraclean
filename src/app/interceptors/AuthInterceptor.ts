import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clonar a requisição e adicionar um cabeçalho Authorization
    const authToken = LocalStorageUtils.getAuth();
    let token = authToken ? authToken.token : "";
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Passar a requisição modificada adiante
    return next.handle(authReq);
  }
}
