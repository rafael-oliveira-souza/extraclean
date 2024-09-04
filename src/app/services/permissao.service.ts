import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, MaybeAsync, GuardResult, Router } from "@angular/router";
import { Rota } from "../app.routes";
import { UsuarioService } from "./usuario.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private usuarioService: UsuarioService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        debugger
        if (this.usuarioService.isLoggedIn()) {
            return true;
        }

        this.router.navigate([Rota.LOGIN]);
        return false;
    }
}