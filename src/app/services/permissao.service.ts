import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync, GuardResult, Router } from "@angular/router";
import { Rota } from "../app.routes";
import { AutenticacaoService } from "./autenticacao.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AutenticacaoService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.authService.isLoggedIn()) {
            return true;
        }

        this.router.navigate([Rota.LOGIN]);
        return false;
    }
}