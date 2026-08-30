import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard funcional para proteger rotas que requerem autenticação
 * 
 * Uso:
 * const routes: Routes = [
 *   { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 * ];
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redireciona para login se não autenticado
  authService.login();
  return false;
};

/**
 * Versão alternativa do guard usando classe (mais verbosa mas mais flexível)
 * Esta versão pode ser usada se precisar de lógica mais complexa
 */
@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Iniciar fluxo de login
    this.authService.login();
    return false;
  }
}
