# Exemplos Avançados de Autenticação OIDC

Este arquivo contém exemplos de código avançados para diferentes cenários de uso da autenticação OIDC.

## 📖 Índice

1. [Componente de Login Customizado](#componente-de-login-customizado)
2. [Proteção com Roles/Permissões](#proteção-com-rolespermissões)
3. [Tratamento de Erros de Autenticação](#tratamento-de-erros-de-autenticação)
4. [Refresh Token Manual](#refresh-token-manual)
5. [Silent Refresh e Sessão](#silent-refresh-e-sessão)

---

## Componente de Login Customizado

Se você quiser uma tela de login customizada em vez do componente padrão `UserProfileComponent`:

```typescript
// src/app/features/login/login.component.ts
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Bem-vindo ao Bastião</h1>
        <p>Faça login para continuar</p>
        <button (click)="login()" class="login-button">
          Entrar com OIDC
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      margin-bottom: 30px;
    }
    
    .login-button {
      background-color: #667eea;
      color: white;
      padding: 12px 30px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1em;
      transition: background-color 0.3s;
    }
    
    .login-button:hover {
      background-color: #764ba2;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}
```

---

## Proteção com Roles/Permissões

Para proteger rotas baseado em roles do usuário:

```typescript
// src/app/core/auth/role.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Verifica se o usuário tem a role necessária
   */
  hasRole(role: string): boolean {
    const profile = this.authService.getUserProfile();
    if (!profile) return false;

    const roles = profile['roles'] || [];
    return roles.includes(role);
  }

  /**
   * Verifica se o usuário tem alguma das roles especificadas
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Verifica se o usuário tem todas as roles especificadas
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }
}

/**
 * Guard funcional para proteger rotas por role
 * Uso: canActivate: [roleGuard('admin')]
 */
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route: ActivatedRouteSnapshot) => {
    const roleService = inject(RoleService);
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      authService.login();
      return false;
    }

    if (roleService.hasRole(requiredRole)) {
      return true;
    }

    // Redireciona para página de acesso negado
    router.navigate(['/access-denied']);
    return false;
  };
};
```

**Uso em rotas:**

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard('admin')]
  },
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [roleGuard('moderator')]
  }
];
```

---

## Tratamento de Erros de Autenticação

Para lidar com erros de autenticação de forma elegante:

```typescript
// src/app/core/auth/auth-error.handler.ts
import { Injectable, inject } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthErrorHandler {
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  setup(): void {
    // Escuta eventos de erro do OAuth
    this.oauthService.events.subscribe(event => {
      switch (event.type) {
        case OAuthEvent.discoveryDocumentLoadingFailed:
          this.handleDiscoveryError(event);
          break;

        case OAuthEvent.tokenRefreshFailed:
          this.handleTokenRefreshError(event);
          break;

        case OAuthEvent.silentRefreshFailed:
          this.handleSilentRefreshError(event);
          break;

        case OAuthEvent.userProfileLoadingFailed:
          this.handleUserProfileError(event);
          break;

        case OAuthEvent.logout:
          this.handleLogout();
          break;
      }
    });
  }

  private handleDiscoveryError(event: any): void {
    console.error('Erro ao carregar documento de descoberta:', event);
    alert('Erro ao conectar com o provedor de autenticação');
  }

  private handleTokenRefreshError(event: any): void {
    console.error('Erro ao renovar token:', event);
    // Pode fazer logout automático
    this.router.navigate(['/login']);
  }

  private handleSilentRefreshError(event: any): void {
    console.warn('Erro no refresh silencioso (não crítico):', event);
    // Não faz nada - o refresh silencioso é opcional
  }

  private handleUserProfileError(event: any): void {
    console.error('Erro ao carregar perfil do usuário:', event);
    alert('Erro ao carregar informações do usuário');
  }

  private handleLogout(): void {
    console.log('Usuário foi desconectado');
    // Limpar dados locais se necessário
  }
}

// Em app.config.ts, adicione:
{
  provide: APP_INITIALIZER,
  useFactory: (handler: AuthErrorHandler) => () => handler.setup(),
  deps: [AuthErrorHandler],
  multi: true
}
```

---

## Refresh Token Manual

Para renovar manualmente o access token:

```typescript
// No seu componente
import { AuthService } from './core/auth/auth.service';
import { inject } from '@angular/core';

export class MyComponent {
  private authService = inject(AuthService);

  async refreshToken(): Promise<void> {
    try {
      await this.authService.refreshToken();
      console.log('Token renovado com sucesso');
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Fazer logout
      this.authService.logout();
    }
  }
}
```

---

## Silent Refresh e Sessão

Configuração avançada para manter a sessão ativa automaticamente:

```typescript
// src/app/core/auth/auth.config.ts - Configuração completa
export const authConfig: AuthConfig = {
  clientId: environment.oidc.clientId,
  redirectUri: environment.oidc.redirectUri,
  postLogoutRedirectUri: environment.oidc.postLogoutRedirectUri,
  issuer: environment.oidc.issuer,
  scope: environment.oidc.scope,
  
  // Authorization Code Flow
  responseType: 'code',
  
  // PKCE (obrigatório)
  disablePKCE: false,
  
  // Refresh Token
  refreshTokenRetryStrategy: {
    maxRetries: 3,
    includeRetryAttempt: true
  },
  
  // Silent Refresh (renovação automática em background)
  useSilentRefresh: true,
  silentRefreshTimeout: 5000,           // Timeout do iframe silencioso
  silentRefreshRedirectUrl: environment.oidc.redirectUri + '/silent-refresh.html',
  
  // Configurações de sessão
  sessionChecksEnabled: true,
  checkSessionIframeUrl: environment.oidc.issuer + '/check_session_iframe',
  sessionCheckInterval: 10000,           // Verificar a cada 10 segundos
  
  // Configurações de timeout
  timeoutFactor: 0.75,
  onTokenExpiration: 'refresh',          // Auto-refresh ao expirar
  
  // Debug
  showDebugInformation: !environment.production,
  strictDiscoveryDocumentValidation: !environment.production,
  
  // CORS
  withCredentials: true
};
```

**Arquivo helper para Silent Refresh (se necessário):**

```html
<!-- src/assets/silent-refresh.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Angular OAuth2 OIDC - Silent Refresh</title>
</head>
<body>
    <h1>Silent Refresh</h1>
</body>
</html>
```

---

## Exemplo Completo com Observable Pattern

Para componentes mais complexos com RxJS:

```typescript
// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div *ngIf="profile$ | async as profile; else loading" class="profile-section">
        <h2>Bem-vindo, {{ profile.name }}!</h2>
        <div class="user-info">
          <p><strong>Email:</strong> {{ profile.email }}</p>
          <p><strong>ID:</strong> {{ profile.sub }}</p>
        </div>
        <button (click)="logout()" class="logout-btn">Sair</button>
      </div>
      <ng-template #loading>
        <p>Carregando informações do usuário...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    
    .profile-section {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 4px;
    }
    
    .logout-btn {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  profile$: Observable<any>;

  ngOnInit(): void {
    // Observa mudanças de autenticação e carrega perfil quando autenticado
    this.profile$ = this.authService.getIsLoggedIn$().pipe(
      startWith(this.authService.isLoggedIn()),
      map(isLoggedIn => {
        if (isLoggedIn) {
          return this.authService.getUserProfile();
        }
        return null;
      })
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
```

---

## Notas Importantes

⚠️ **Segurança:**
- Nunca armazene tokens em `localStorage` em produção (use `sessionStorage` ou cookies seguros)
- Configure HTTPS em produção
- Valide tokens no backend sempre
- Implemente CORS corretamente

⚠️ **Performance:**
- Limpe subscriptions em `OnDestroy`
- Use `OnPush` change detection strategy quando possível
- Considere lazy loading de módulos de autenticação

✅ **Best Practices:**
- Use o padrão Observable para estado da autenticação
- Trate erros de rede adequadamente
- Implemente retry logic para requisições que falham
- Registre eventos de segurança importantes
