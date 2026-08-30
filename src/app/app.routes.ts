import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { BastiaoReaderComponent } from './features/bastiao-reader/bastiao-reader.component';

/**
 * EXEMPLO DE COMO PROTEGER ROTAS COM O AUTHGUARD
 * 
 * Descomente as rotas abaixo quando criar novos componentes que requerem autenticação
 */
export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'ler/:id', component: BastiaoReaderComponent, canActivate: [authGuard] },
    
    // EXEMPLO: Rota protegida por autenticação
    // {
    //   path: 'dashboard',
    //   component: DashboardComponent,
    //   canActivate: [authGuard]  // Usuário precisa estar autenticado
    // },

    // EXEMPLO: Rota protegida aninhada
    // {
    //   path: 'admin',
    //   canActivate: [authGuard],
    //   children: [
    //     { path: 'users', component: AdminUsersComponent },
    //     { path: 'settings', component: AdminSettingsComponent }
    //   ]
    // },
    
    { path: '**', redirectTo: '' }
];
