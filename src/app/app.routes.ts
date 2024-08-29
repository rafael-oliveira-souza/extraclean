import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './tabs/menu/menu.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';

export enum Rota {
    NONE = '',
    CADASTRO = 'cadastro',
    HOME = 'home',
    LOGIN = 'login',
    PAGAMENTO = 'pagamento',
}

export const routes: Routes = [
    { path: Rota.NONE, component: MenuComponent },
    { path: Rota.HOME, component: MenuComponent },
    { path: Rota.CADASTRO, component: CadastroComponent },
    { path: Rota.LOGIN, component: LoginComponent }
];
