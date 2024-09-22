import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './tabs/menu/menu.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { AuthGuard } from './services/permissao.service';
import { PagamentoComponent } from './components/pagamento/pagamento.component';
import { AdminComponent } from './components/admin/admin.component';

export enum Rota {
    NONE = '',
    ADMIN = 'admin',
    CADASTRO = 'cadastro',
    HOME = 'home',
    LOGIN = 'login',
    PAGAMENTO = 'pagamento',
}

export const routes: Routes = [
    { path: Rota.NONE, component: MenuComponent },
    { path: Rota.HOME, component: MenuComponent },
    { path: Rota.ADMIN, component: AdminComponent },
    { path: Rota.CADASTRO, component: CadastroComponent },
    { path: Rota.LOGIN, component: LoginComponent },
    { path: Rota.PAGAMENTO, component: PagamentoComponent },
    // { path: '**', redirectTo: '' }
];